import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}
  async create(createVendorDto: CreateVendorDto) {
    return await this.vendorRepository.save(createVendorDto);
  }
  async findAll() {
    return await this.vendorRepository.find();
  }

  async findOne(id: string) {
    return await this.vendorRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    return await this.vendorRepository.update(id, updateVendorDto);
  }

  async remove(id: string) {
    return await this.vendorRepository.delete(id);
  }

  async findByCountry(country: string) {
    return await this.vendorRepository.find({
      where: {
        countries_supported: Like(`%${country}%`),
      },
    });
  }
  async findByService(service: string) {
    return await this.vendorRepository.find({
      where: {
        services_offered: Like(`%${service}%`),
      },
    });
  }
}
