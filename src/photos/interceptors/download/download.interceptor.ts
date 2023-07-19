import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RESPONSE_PASSTHROUGH_METADATA } from '@nestjs/common/constants';
import { Response } from 'express';
import { EMPTY, Observable, switchMap } from 'rxjs';

export class DownloadFile {
  file: string;
  name: string;

  constructor(data?: Partial<DownloadFile>) {
    Object.assign(this, data);
  }
}

@Injectable()
export class DownloadInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const res: Response = context.switchToHttp().getResponse();

    // Reflect.defineMetadata(
    //   RESPONSE_PASSTHROUGH_METADATA,
    //   false,
    //   context.getClass(),
    //   'download',
    // );

    return next.handle().pipe(
      switchMap((file: DownloadFile) => {

        return new Observable((subscriber) => {
          res.download(file.file, file.name, (err) => {
            console.log('download finish', err);
            subscriber.next('');
            subscriber.complete();
          });

        });
      }),
    );
  }
}
