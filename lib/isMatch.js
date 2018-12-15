import pathToRegexp from 'path-to-regexp';
export default function isMatch(compiledPathname, sourcePathname) {
  if (sourcePathname === null) {
    return false;
  }

  var routeRegEx = pathToRegexp(sourcePathname);
  return !!compiledPathname.match(routeRegEx);
}