import Mock from 'mockjs'
import testAPI from './test'

Mock.mock('/test/list', 'get', testAPI.getList)

export default Mock
