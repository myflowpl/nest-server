import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    @Inject('test')
    test: string;

    constructor(
        @Inject('test')
        private test2: string,
    ) {}

}
