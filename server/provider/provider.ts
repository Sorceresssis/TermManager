import 'reflect-metadata';

import { Container } from 'inversify';

import ResourcePath from '@/config/resource-path';
import { AuthController } from '@/controller/AuthController';
import { SecondCategoryController } from '@/controller/SecondCategoryController';
import { TagController } from '@/controller/TagController';
import { TagExplanationController } from '@/controller/TagExplanationController';
import { TopCategoryController } from '@/controller/TopCategoryController';
import SecondCategoryDao from '@/dao/SecondCategoryDao';
import TagDao from '@/dao/TagDao';
import TopCategoryDao from '@/dao/TopCategoryDao';
import TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';
import ClientService from '@/service/ClientService';
import SecondCategoryService from '@/service/SecondCategoryService';
import TagExplanationService from '@/service/TagExplanationService';
import TagService from '@/service/TagService';
import TopCategoryService from '@/service/TopCategoryService';

const container = new Container();

container.bind(injectType.TagDB).toConstantValue(new TagDB(ResourcePath.TAG_DATABASE_FILE));

container.bind(injectType.TopCategoryDao).to(TopCategoryDao).inSingletonScope();
container.bind(injectType.SecondCategoryDao).to(SecondCategoryDao).inSingletonScope();
container.bind(injectType.TagDao).to(TagDao).inSingletonScope();

container.bind(injectType.TopCategoryService).to(TopCategoryService).inSingletonScope();
container.bind(injectType.SecondCategoryService).to(SecondCategoryService).inSingletonScope();
container.bind(injectType.TagService).to(TagService).inSingletonScope();
container.bind(injectType.TagExplanationService).to(TagExplanationService).inSingletonScope();
container.bind(injectType.ClientService).to(ClientService).inSingletonScope();


container.bind(injectType.AuthController).to(AuthController).inSingletonScope();
container.bind(injectType.TagExplanationController).to(TagExplanationController).inSingletonScope();
container.bind(injectType.TopCategoryController).to(TopCategoryController).inSingletonScope();
container.bind(injectType.SecondCategoryController).to(SecondCategoryController).inSingletonScope();
container.bind(injectType.TagController).to(TagController).inSingletonScope();

export default container;