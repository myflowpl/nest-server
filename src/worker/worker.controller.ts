import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ContactsController } from '../contacts/contacts.controller';

@Controller('worker')
export class WorkerController {

    constructor(
        private contactController: ContactsController
    ) {}

    @MessagePattern({ cmd: 'sum' })
    sum(data: number[]): number {
        console.log('data incoming', data)
        return data.reduce((a,b) => a+b )
    }

    @EventPattern('user_created')
    async handleUserCreated(data: Record<string, unknown>) {
    
        console.log('incoming event', data, await this.contactController.findOne(2))
    }
}
