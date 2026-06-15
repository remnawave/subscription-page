import { Module } from '@nestjs/common';

import { AppConfigModule } from '@common/config/app-config/app-config.module';
import { AxiosModule } from '@common/axios/axios.module';

import { SubscriptionPageBackendModule } from '@modules/subscription-page-backend.modules';

@Module({
    imports: [AppConfigModule, AxiosModule, SubscriptionPageBackendModule],
})
export class AppModule {}
