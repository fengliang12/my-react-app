//路径参数
const handleRoute = (route: string, options: object) => {
  let query = "";
  if (!options) return route;
  Object.keys(options).map((key: any) => {
    query += `&${key}=${options[key]}`;
  });
  query = query.slice(1);
  if (!query) {
    return route;
  }
  const newUrl = route.includes("?")
    ? `${route}&${query}`
    : `${route}?${query}`;
  return newUrl;
};
export default handleRoute;
