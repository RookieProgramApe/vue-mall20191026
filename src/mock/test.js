import Mock from 'mockjs'

const Random = Mock.Random

let List = []
const count = 2
for (var i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    src: Random.dataImage('300x150', 'mock的图片'),
    date: Random.date() + '' + Random.time()
  }))
}
export default {
  getList: () => {
    return {
      total: List.length,
      List: List
    }
  }
}
