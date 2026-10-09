import { useMemo } from 'react';
import { useAppData } from '../../app/AppDataProvider';
import { buildCatalog, getAncestors, getChildren, getNode } from './index';

export default function useCatalog() {
  const data = useAppData()?.data;
  return useMemo(() => {
    const catalog = buildCatalog(data);
    return {
      catalog,
      getNode: (id) => getNode(id, catalog),
      getChildren: (id) => getChildren(id, catalog),
      getAncestors: (id) => getAncestors(id, catalog),
    };
  }, [data?.customTopics, data?.customProblems]);
}
