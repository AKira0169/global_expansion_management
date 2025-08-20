import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ResearchDocument,
  ResearchDocumentDocument,
} from './modules/research-documents/entities/research-document.entity';
import { Match } from './modules/matches/entities/match.entity';
import { Project } from './modules/projects/entities/project.entity';

@Injectable()
export class AppService {
  constructor(
    private dataSource: DataSource,
    @InjectModel(ResearchDocument.name)
    private researchDocModel: Model<ResearchDocumentDocument>,
  ) {}

  async topVendors(): Promise<any> {
    const matchRepo = this.dataSource.getRepository(Match);

    // Step 1: vendors and avg score per country (last 30 days)
    const rawResults = await matchRepo
      .createQueryBuilder('m')
      .innerJoin('m.vendor', 'v')
      .innerJoin('m.project', 'p')
      .select('v.id', 'vendorId')
      .addSelect('v.name', 'vendorName')
      .addSelect('p.country', 'country')
      .addSelect('AVG(m.score)', 'avgScore')
      .where('m.createdAt >= NOW() - INTERVAL 30 DAY')
      .groupBy('v.id')
      .addGroupBy('p.country')
      .orderBy('p.country', 'ASC')
      .addOrderBy('avgScore', 'DESC')
      .getRawMany();

    // Step 2: Group vendors by country and take top 3
    const groupedByCountry: Record<string, any[]> = {};
    for (const row of rawResults) {
      if (!groupedByCountry[row.country]) {
        groupedByCountry[row.country] = [];
      }
      if (groupedByCountry[row.country].length < 3) {
        groupedByCountry[row.country].push({
          vendorId: row.vendorId,
          vendorName: row.vendorName,
          avgScore: parseFloat(row.avgScore),
        });
      }
    }

    // Step 3: Count research docs from Mongo
    const countries = Object.keys(groupedByCountry);
    const countryDocCounts: Record<string, number> = {};

    for (const country of countries) {
      const projects = await this.dataSource
        .getRepository(Project)
        .createQueryBuilder('p')
        .select('p.id', 'id')
        .where('p.country = :country', { country })
        .getRawMany();

      const projectIds = projects.map((p) => p.id);

      if (projectIds.length === 0) {
        countryDocCounts[country] = 0;
        continue;
      }

      const count = await this.researchDocModel.countDocuments({
        projectId: { $in: projectIds },
      });

      countryDocCounts[country] = count;
    }

    // Step 4: Combine results
    return countries.map((country) => ({
      country,
      topVendors: groupedByCountry[country],
      researchDocCount: countryDocCounts[country] || 0,
    }));
  }
}
