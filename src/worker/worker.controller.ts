import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('worker')
export class WorkerController {

  @MessagePattern('ADD_NUMBERS')
  add(data: number[]): number {
    
    console.log('WORKING ON', data);

    return (data || []).reduce((a,b) => a+b);
  }
}
