const PONTUSX_ADDRESSES = require('./pontusxAddresses.json')

module.exports = {
  whitelists: {
    'nft.owner': ['0x38B7c70DE4283e9ebD11eCEFf1Be74858d43D001'], // Dunavnet Limited
    'datatokens.address': [
      '0xab4eEb199b2d35CDcEd01d82426CD18907033d1D', // SENSE - City of Cartagena Weather Data via FIWARE Context Broker
      '0x15450500f46aA57d0f0f9b0e0a649A96A0301aE9', // SENSE - City of Cartagena Noise Levels Data via FIWARE Context Broker
      '0x7266CB767D7c8a627f074Ed763660881C7d5e32B', // SENSE - City of Cartagena Air Quality Data via FIWARE Context Broker
      '0xb1e31cd85b1FE8b3a21c9D10e1567ec987599809', // SENSE - City of Cartagena Parking Sensor Data via FIWARE Context Broker
      '0x752Bcd04A2b0Ef9B4cAfBdebFc98739a6b2D6A52', // SENSE - City of Kiel Parking Spot Data via FIWARE Context Broker
      '0x33A89336a8F49687f42E1c5fC565F54C46a9984A', // SENSE - API - Water level Kiel Fjord - List of stations
      '0x65616b5D1F99b4C8C98e67Fc2B45F66eC5093Cb5', // SENSE - Time Serie - Citizens in the Departments of the City of Kiel
      '0x33e1Eb6aE40708Acbb96f1Dc47470495Da60731f' // SENSE - Time Serie - Citizens in the Departments of the City of Kiel
    ]
  },
  featured: [],
  verifiedAddresses: PONTUSX_ADDRESSES
}
