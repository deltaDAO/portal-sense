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
  featured: [
    {
      title: 'Assets from Cartagena',
      assets: [
        'did:op:b7e1389d33966d112796e5825a775eb3cec0a005a48ca29d440a705ffa1ecf19', // SENSE - City of Cartagena Weather Data via FIWARE Context Broker
        'did:op:313514759ab99f27db7d880af2c0a188478561e1724122d693ff900aaba60f80', // SENSE - City of Cartagena Noise Levels Data via FIWARE Context Broker
        'did:op:f73104856399b8bd4e3686f2e9e26459528e47fe9085fb93129e9558593b000c', // SENSE - City of Cartagena Air Quality Data via FIWARE Context Broker
        'did:op:f223d0a08bac8ad82add517f979803ecfe2b53e8f1d9b64361917a2cdcd099ae' // SENSE - City of Cartagena Parking Sensor Data via FIWARE Context Broker
      ]
    },
    {
      title: 'Assets from Kiel',
      assets: [
        'did:op:fddf107dd04454758f151308be2422963f14f311ae86d33f7bfef0f364acced9', // SENSE - City of Kiel Parking Spot Data via FIWARE Context Broker
        'did:op:fcb599d25e942bcb45505ae199c9b29770b743f93fde807ccc359abdf0986036', // SENSE - API - Water level Kiel Fjord - List of stations
        'did:op:143dd6b5984410bc5272f3f70e6e4505f618ec7660e60a2bea08e6a6f2d05b9b', // SENSE - Time Serie - Citizens in the Departments of the City of Kiel
        'did:op:2bb91303f2a728bcb7b45ccf62b2d0277f09d7704c598c17ecbbdd9ec4287e3b' // SENSE - Time Serie - Citizens in the Departments of the City of Kiel
      ]
    }
  ],
  verifiedAddresses: PONTUSX_ADDRESSES
}
