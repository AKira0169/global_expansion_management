import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/guards/abilities.guard';
import { Vendor } from './entities/vendor.entity';
import { Action } from 'src/ability/ability.factory';
import { CheckAbility } from 'src/Decorator/abilities.decorator';

@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @CheckAbility({
    action: Action.Create,
    subject: Vendor,
  })
  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @CheckAbility({
    action: Action.Read,
    subject: Vendor,
  })
  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @CheckAbility({
    action: Action.Read,
    subject: Vendor,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @CheckAbility({
    action: Action.Update,
    subject: Vendor,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @CheckAbility({
    action: Action.Delete,
    subject: Vendor,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}
