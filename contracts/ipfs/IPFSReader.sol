// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSReader {
    string private ipfsGateway;

    constructor(string memory _ipfsGateway) {
        ipfsGateway = _ipfsGateway;
    }

    function setIPFSGateway(string memory _ipfsGateway) internal {
        ipfsGateway = _ipfsGateway;
    }

    function ipfsRead(bytes32 _hash) internal view returns (bytes memory) {
        string memory url = string(abi.encodePacked(ipfsGateway, "/ipfs/", _toBase58String(_hash)));
        bytes memory data = _fetchURL(url);
        return data;
    }

    function _fetchURL(string memory url) private view returns (bytes memory) {
        (bool success, bytes memory data) = _fetchURLWithRetries(url, 3, 1000);
        require(success, "Failed to fetch URL");
        return data;
    }

    function _fetchURLWithRetries(string memory url, uint256 retries, uint256 retryDelay) private view returns (bool success, bytes memory data) {
        for (uint256 i = 0; i < retries; i++) {
            (success, data) = _fetchURLImpl(url);
            if (success) {
                return (true, data);
            }
            if (i < retries - 1) {
                // sleep for retryDelay milliseconds
                _sleep(retryDelay);
            }
        }
        return (false, "");
    }

    function _fetchURLImpl(string memory url) private view returns (bool success, bytes memory data) {
        (bool status, bytes memory result) = address(0x0).staticcall{gas: 3000000}(
            abi.encodeWithSignature("get(string)", url)
        );
        if (status && result.length > 0) {
            return (true, result);
        }
        return (false, "");
    }

    function _sleep(uint256 delay) private view {
        uint256 wakeUpTime = block.timestamp + delay / 1000;
        while (block.timestamp < wakeUpTime) {
            // Do nothing
        }
    }

    function _toBase58String(bytes32 value) private pure returns (string memory) {
        bytes memory alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        uint256 base = alphabet.length;

        uint256[] memory digits = new uint256[](46); // ceil(32 * log(2) / log(base)) + 1
        uint256 digitsLength = 0;
        uint256 number = uint256(value);

        while (number > 0) {
            digits[digitsLength] = number % base;
            digitsLength++;
            number = number / base;
        }

        bytes memory result = new bytes(digitsLength);
        for (uint256 i = 0; i < digitsLength; i++) {
            result[i] = alphabet[digits[digitsLength - i - 1]];
        }

        return string(result);
    }
}
