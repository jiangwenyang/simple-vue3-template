import { getResourceMenuPer } from '@/services/auth'

export enum ResourceType {
  菜单,
  按钮,
  接口,
  样式,
}

export interface Resource {
  id: number
  pId: number
  label: string
  childNode: Resource[] | null
  nodeLevel: number
  selected: number
  name: string
  icon: string
  type: ResourceType
  url: string
  menuOrder: string
  pid: number
}

// 扁平化资源
export type FlatResource = Resource & { parents?: FlatResource[]; siblings?: FlatResource[] }

// 过滤资源
const filterResource = (resource: Resource[], type: ResourceType) =>
  resource.reduce((arr, item) => {
    if (item.type === type) {
      const newItem = { ...item }
      if (newItem.childNode && newItem.childNode.length) {
        newItem.childNode = filterResource(newItem.childNode, type)
      }
      arr.push(newItem)
    }
    return arr
  }, [] as Resource[])

// 获取资源编码
const getResourceCodes = (resource: Resource[]) =>
  resource.reduce((arr, item) => {
    arr.push(item.url)
    if (item.childNode && item.childNode.length) {
      arr = arr.concat(getResourceCodes(item.childNode))
    }
    return arr
  }, [] as string[])

// 获取扁平化菜单
const getFlatResource = (resourceMenu: Resource[], parents: Resource[] = []) => {
  const results: FlatResource[] = []
  resourceMenu.forEach((item) => {
    const newItem = {
      ...item,
      siblings: resourceMenu.filter((child) => child !== item),
      parents,
    }
    results.push(newItem)
    const newParents = [...parents, newItem]
    if (item.childNode && item.childNode.length) {
      results.push(...getFlatResource(item.childNode, newParents))
    }
  })
  return results
}

export const useResourceStore = defineStore(
  'resourceStore',
  () => {
    const hasFetchResource = ref(false) // 是否已获取过resource

    const resource = ref([]) // 资源

    // 菜单资源
    // FIXME: 后端返回的type感觉有问题
    const resourceMenu = computed(() => filterResource(resource.value, ResourceType['按钮']))

    // 按钮资源
    const resourceButton = computed(() => filterResource(resource.value, ResourceType['按钮']))

    // 接口资源
    const resourceAPI = computed(() => filterResource(resource.value, ResourceType['接口']))

    // 样式资源
    const resourceStyle = computed(() => filterResource(resource.value, ResourceType['样式']))

    // 菜单权限编码
    const resourceMenuCodes = computed(() => getResourceCodes(resourceMenu.value))

    // 按钮权限编码
    const resourceButtonCodes = computed(() => getResourceCodes(resourceButton.value))

    // 扁平化资源菜单
    const flatResourceMenu = computed(() => getFlatResource(resourceButton.value))

    const getResource = async () => {
      const { data } = await getResourceMenuPer()
      resource.value = data
      hasFetchResource.value = true
    }

    // 重置store
    const resetStore = () => {
      hasFetchResource.value = false
      resource.value = []
    }

    return {
      resource,
      resourceMenu,
      resourceButton,
      resourceAPI,
      resourceStyle,
      resourceMenuCodes,
      resourceButtonCodes,
      flatResourceMenu,
      getResource,
      hasFetchResource,
      resetStore,
    }
  },
  {
    persist: true,
  },
)
