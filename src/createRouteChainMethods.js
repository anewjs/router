import isMatch from './isMatch'
import { compile } from 'path-to-regexp'

export default function createRouteChainMetods(context, name, path, route) {
    const compiledPath = compile(path)

    return {
        path: compiledPath,
        data: prop => (prop ? route[prop] : route),
        routes: (pathname, { strict } = {}) => context.match(pathname, { name, strict }),
        contains: (pathname, { strict } = {}) => context.contains(pathname, { name, strict }),
        is: pathname => isMatch(pathname, path),
        redirect: params => context.redirect(compiledPath(params)),
    }
}
