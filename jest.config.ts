import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // 브라우저 환경 시뮬레이션 (zustand 테스트 시 필수)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // 전역 설정
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
  globals: {
    'ts-jest': {
        tsconfig: 'tsconfig.test.json'
    }
  }
};

export default config;
