import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectStatus } from '../projects/enums/ProjectStatus';
import { EmailService } from '../email/email.service';

@Injectable()
export class MatchesCornJob {
  private readonly BATCH_SIZE = 50; // adjust depending on DB size & server capacity
  private readonly CONCURRENCY = 5; // how many projects to process in parallel

  constructor(
    private readonly dataSource: DataSource,
    private readonly projectsService: ProjectsService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Running daily vendor–project match refresh...');
    const projectRepo = this.dataSource.getRepository(Project);
    let page = 0;
    let totalProcessed = 0;
    while (true) {
      const projects = await projectRepo.find({
        where: { status: ProjectStatus.ACTIVE },
        skip: page * this.BATCH_SIZE,
        take: this.BATCH_SIZE,
        relations: ['user'],
      });
      if (projects.length === 0) break;
      console.log(`Processing batch ${page + 1} (${projects.length} projects)...`);
      // Process in chunks with limited concurrency
      const chunks: Project[][] = [];
      for (let i = 0; i < projects.length; i += this.CONCURRENCY) {
        chunks.push(projects.slice(i, i + this.CONCURRENCY));
      }
      for (const chunk of chunks) {
        await Promise.all(
          chunk.map((project) =>
            this.projectsService
              .rebuildProjectVendorMatching(project.id)
              .then(() =>
                this.emailService.send({
                  to: project.user.email,
                  subject: 'Project Vendor Match',
                  html: 'Your project vendor match has been updated.',
                }),
              )
              .catch((err) => console.error(`❌ Failed project ${project.id}:`, err.message)),
          ),
        );
      }
      totalProcessed += projects.length;
      page++;
    }
    console.log(`✅ Refreshed matches for ${totalProcessed} active projects`);
  }
}
