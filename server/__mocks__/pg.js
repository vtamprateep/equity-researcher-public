const mClient = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
};

const Pool = jest.fn(() => mClient);

module.exports = { Pool };