//SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;

struct Document {
    string cid;
    string metaData;
    uint256 timestamp;
}

contract DigitalLocker {
    mapping(string => Document[]) private userDocuments;
    address public admin;

    event DocumentAdded(string indexed uid, string cid);

    constructor() { admin = msg.sender; }

    function addDocument(
        string calldata uid,
        string calldata cid,
        string calldata metaData
    ) external onlyAdmin {
        userDocuments[uid].push(Document(cid, metaData, block.timestamp));
        emit DocumentAdded(uid, cid);
    }

    function getDocumentMeta(
        string calldata uid, 
        string calldata cid
    ) external view returns (string memory) {
        Document[] storage docs = userDocuments[uid];
        for (uint i = 0; i < docs.length; i++) {
            if (keccak256(bytes(docs[i].cid)) == keccak256(bytes(cid))) {
                return docs[i].metaData;
            }
        }
        revert("Document not found");
    }

    modifier onlyAdmin() { require(msg.sender == admin); _; }
}
