export const agentOwnerRegistryAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "type": "address",
                "name": "_governanceSettings",
                "internalType": "contract IGovernanceSettings"
            },
            {
                "type": "address",
                "name": "_initialGovernance",
                "internalType": "address"
            },
            {
                "type": "bool",
                "name": "_supportRevoke",
                "internalType": "bool"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "addAddressToWhitelist",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "addAddressesToWhitelist",
        "inputs": [
            {
                "type": "address[]",
                "name": "_addresses",
                "internalType": "address[]"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "allowAll",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "cancelGovernanceCall",
        "inputs": [
            {
                "type": "bytes4",
                "name": "_selector",
                "internalType": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "executeGovernanceCall",
        "inputs": [
            {
                "type": "bytes4",
                "name": "_selector",
                "internalType": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "string",
                "name": "",
                "internalType": "string"
            }
        ],
        "name": "getAgentDescription",
        "inputs": [
            {
                "type": "address",
                "name": "_managementAddress",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "string",
                "name": "",
                "internalType": "string"
            }
        ],
        "name": "getAgentIconUrl",
        "inputs": [
            {
                "type": "address",
                "name": "_managementAddress",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "string",
                "name": "",
                "internalType": "string"
            }
        ],
        "name": "getAgentName",
        "inputs": [
            {
                "type": "address",
                "name": "_managementAddress",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "name": "getManagementAddress",
        "inputs": [
            {
                "type": "address",
                "name": "_workAddress",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "name": "getWorkAddress",
        "inputs": [
            {
                "type": "address",
                "name": "_managementAddress",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "address"
            }
        ],
        "name": "governance",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "address",
                "name": "",
                "internalType": "contract IGovernanceSettings"
            }
        ],
        "name": "governanceSettings",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "initialise",
        "inputs": [
            {
                "type": "address",
                "name": "_governanceSettings",
                "internalType": "contract IGovernanceSettings"
            },
            {
                "type": "address",
                "name": "_initialGovernance",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "isExecutor",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "isWhitelisted",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "productionMode",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "revokeAddress",
        "inputs": [
            {
                "type": "address",
                "name": "_address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "setAllowAll",
        "inputs": [
            {
                "type": "bool",
                "name": "_allowAll",
                "internalType": "bool"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "setWorkAddress",
        "inputs": [
            {
                "type": "address",
                "name": "_ownerWorkAddress",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "pure",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "supportsInterface",
        "inputs": [
            {
                "type": "bytes4",
                "name": "_interfaceId",
                "internalType": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "supportsRevoke",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "switchToProductionMode",
        "inputs": []
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "uint256",
                "name": "allowedAfterTimestamp",
                "internalType": "uint256"
            },
            {
                "type": "bytes",
                "name": "encodedCall",
                "internalType": "bytes"
            }
        ],
        "name": "timelockedCalls",
        "inputs": [
            {
                "type": "bytes4",
                "name": "",
                "internalType": "bytes4"
            }
        ]
    },
    {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "whitelistAndDescribeAgent",
        "inputs": [
            {
                "type": "address",
                "name": "_managementAddress",
                "internalType": "address"
            },
            {
                "type": "string",
                "name": "_name",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_description",
                "internalType": "string"
            },
            {
                "type": "string",
                "name": "_iconUrl",
                "internalType": "string"
            }
        ]
    },
    {
        "type": "event",
        "name": "AgentDataChanged",
        "inputs": [
            {
                "type": "address",
                "name": "managementAddress",
                "indexed": true
            },
            {
                "type": "string",
                "name": "name",
                "indexed": false
            },
            {
                "type": "string",
                "name": "description",
                "indexed": false
            },
            {
                "type": "string",
                "name": "iconUrl",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "GovernanceCallTimelocked",
        "inputs": [
            {
                "type": "bytes4",
                "name": "selector",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "allowedAfterTimestamp",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "encodedCall",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "GovernanceInitialised",
        "inputs": [
            {
                "type": "address",
                "name": "initialGovernance",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "GovernedProductionModeEntered",
        "inputs": [
            {
                "type": "address",
                "name": "governanceSettings",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TimelockedGovernanceCallCanceled",
        "inputs": [
            {
                "type": "bytes4",
                "name": "selector",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TimelockedGovernanceCallExecuted",
        "inputs": [
            {
                "type": "bytes4",
                "name": "selector",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Whitelisted",
        "inputs": [
            {
                "type": "address",
                "name": "value",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WhitelistingRevoked",
        "inputs": [
            {
                "type": "address",
                "name": "value",
                "indexed": false
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WorkAddressChanged",
        "inputs": [
            {
                "type": "address",
                "name": "managementAddress",
                "indexed": true
            },
            {
                "type": "address",
                "name": "prevWorkAddress",
                "indexed": false
            },
            {
                "type": "address",
                "name": "workAddress",
                "indexed": false
            }
        ],
        "anonymous": false
    }
] as const;
