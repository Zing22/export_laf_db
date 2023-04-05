import cloud from '@/cloud-sdk'

function packRes(err, data) {
  return { err: err, data: data};
}

async function getInfo() {
  //查询全部集合名
  const collections = await cloud.mongo.db.listCollections().toArray();
  const filteredData = collections.filter(
    (obj) => !obj.name.startsWith("__")
  );
  const dbListName = filteredData.map((obj) => obj.name);
  let dbInfo = {}
  for (const DbName of dbListName) {
    //数据库：查询表名为DbName的数据库的总数
    const db = cloud.database();
    const collection = db.collection(DbName);
    const countResult = await collection.count();
    const total = countResult.total;
    //记录全部数据表信息
    dbInfo[DbName] = total
  }
  return dbInfo;
}

async function getData(collName, skipCount, limitCount) {
  // 数据库操作
  const db = cloud.database()
  const r = await db.collection(collName).skip(skipCount).limit(limitCount).get();
  return r.data;
}

exports.main = async function (ctx: FunctionContext) {
  // body, query 为请求参数, auth 是授权对象
  const { auth, body, query } = ctx

  const op = body.op;

  if (op == "info") {
    // 返回数据库情况
    const data = await getInfo();
    return packRes(null, data);
  } else if (op == "data") {
    // 返回数据
    const data = await getData(body.coll, body.skip, body.limit);
    return packRes(null, data);
  }

  return packRes(`Unknow op "${op}"`, null);
}
