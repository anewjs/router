module.exports = {
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['./test/setup.ts'],
    moduleNameMapper: {
        '^src(.*)$': '<rootDir>/src$1',
    },
}
