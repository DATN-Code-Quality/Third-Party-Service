import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Sources } from "./interface/Source";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SourceService{
    constructor(
        private readonly httpService:HttpService,
    ){}
    async getSourceCodeByKey(key: string): Promise<Sources> {
        
        const { data } = await firstValueFrom(
          this.httpService
            .get(`${process.env.SONARQUBE_BASE_URL}/sources/lines`, {
              auth: {
                username: process.env.SONARQUBE_USERNAME,
                password: process.env.SONARQUBE_PASSWORD,
              },
              params: { key: key },
            })
            .pipe(),
        );

        
    
        if (data) {
            const sources=[...data.sources.map(
                source=>({
                    line:source.line,
                    code:source.code,
                }))];
          return {
            sources:sources,
          };
        }
    
        return null;
      }
    
}