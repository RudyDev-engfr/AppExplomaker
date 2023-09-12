export default function logGroup(type, data) {
  console.groupCollapsed(type)
  console.log(data)
  console.groupEnd()
}
