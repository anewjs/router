import * as pathToRegexp from 'path-to-regexp'

export default function isMatch(compiledPathname, sourcePathname) {
    if (sourcePathname === null) {
        return false
    }

    const routeRegEx = (pathToRegexp.pathToRegexp || pathToRegexp.default)(sourcePathname)

    return !!compiledPathname.match(routeRegEx)
}
