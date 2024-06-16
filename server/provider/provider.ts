import 'reflect-metadata'
import { Container } from "inversify"
import injectType from './injectType'
import config from '../config'

import TagDB from '../db/tagDB'

import TopCategoryDao from '../dao/TopCategoryDao'
import SecondCategoryDao from '../dao/SecondCategoryDao'
import TagDao from '../dao/TagDao'

import TopCategoryService from '../service/TopCategoryService'
import SecondCategoryService from '../service/SecondCategoryService'
import TagService from '../service/TagService'
import TagExplanationService from '../service/TagExplanationService'
import ClientService from '../service/ClientService'


const container = new Container()

container.bind(injectType.TagDB).toConstantValue(new TagDB(config.tagDBPath))

container.bind(injectType.TopCategoryDao).to(TopCategoryDao).inSingletonScope()
container.bind(injectType.SecondCategoryDao).to(SecondCategoryDao).inSingletonScope()
container.bind(injectType.TagDao).to(TagDao).inSingletonScope()

container.bind(injectType.TopCategoryService).to(TopCategoryService).inSingletonScope()
container.bind(injectType.SecondCategoryService).to(SecondCategoryService).inSingletonScope()
container.bind(injectType.TagService).to(TagService).inSingletonScope()
container.bind(injectType.TagExplanationService).to(TagExplanationService).inSingletonScope()
container.bind(injectType.ClientService).to(ClientService).inSingletonScope()


export default container