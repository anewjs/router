module.exports = {
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['./test/setup.ts'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleNameMapper: {
        '^src(.*)$': '<rootDir>/src$1',
    },
}
