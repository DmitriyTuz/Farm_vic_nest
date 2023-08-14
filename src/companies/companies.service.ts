import { Injectable } from '@nestjs/common';
import {HelpersService} from "../lib/helpers/helpers.service";
import {CheckerService} from "../lib/checker/checker.service";
import {InjectModel} from "@nestjs/sequelize";
import {Company} from "./companies.model";

@Injectable()
export class CompaniesService {

    constructor(@InjectModel(Company) private companyRepository: typeof Company,
        private helperService: HelpersService,
        private checkerService: CheckerService
    ) {}

    async createCompany(companyData) {
        const requiredFields = ['name'];
        this.checkerService.checkRequiredFields(companyData, requiredFields, false);
        const { name } = companyData;

        this.checkerService.checkName({name});

        const createdFields = ['logo', 'name'];
        const newCompany = this.helperService.getModelData(createdFields, companyData);

        const company = await this.companyRepository.create(newCompany);

        return {company}
    }
}
