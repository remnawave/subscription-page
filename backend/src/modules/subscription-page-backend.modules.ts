import { Module } from '@nestjs/common';

import { RootModule } from './root/root.module';

@Module({
    imports: [RootModule],
})
export class SubscriptionPageBackendModule {}
