const fs = require('fs')
const path = require('path')

const PATH = path.resolve(__dirname, '../../data/nodes')

const dirs = fs.readdirSync(PATH)
dirs.forEach(name => {
  const raw = fs.readFileSync(`${PATH}/${name}`)
  const object = JSON.parse(raw)
  const target = object.values[0]
  const typeName = target['_typeName']

  const inner = Object.keys(target)
    .filter(key => key !== 'id' && key !== '_typeName')
    .map(key => `${key}: String`)
    .map(e => '  ' + e)
    .join('\n')
  const data = `type ${typeName} {
  id: ID! @unique
${inner}
}
`
  fs.appendFile(path.resolve(__dirname, '../../dist/bundle.datamodel.graphql'), data, 'utf-8', err => {
    if (err) console.log(err)
  })

  const lower = typeName.toLowerCase()
  const model = `
  ${lower}: (_, args, context, info) => context.prisma.query.${lower}({}, info),`

  fs.appendFile(path.resolve(__dirname, '../../dist/bundle.schema.graphql'), model, 'utf-8', err => {
    if (err) console.log(err)
  })
})
