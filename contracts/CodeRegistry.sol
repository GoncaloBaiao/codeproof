// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CodeRegistry
 * @dev Smart contract for registering and verifying code ownership on blockchain
 * Allows developers to prove code authorship immutably with SHA-256 hash, timestamp, and author address
 */
contract CodeRegistry {
    // Struct to store registration details
    struct Registration {
        address author;
        uint256 timestamp;
        string metadata;
        bool exists;
    }

    // Mapping from hash to registration details
    mapping(string => Registration) public registrations;

    // Array to track all registered hashes (for indexing)
    string[] public registeredHashes;

    // Event emitted when code is successfully registered
    event CodeRegistered(
        string indexed hash,
        address indexed author,
        uint256 timestamp,
        string metadata
    );

    /**
     * @dev Register a code hash with metadata on the blockchain
     * @param hash The SHA-256 hash of the code
     * @param metadata JSON-encoded metadata containing projectName, description, etc.
     * Reverts if the hash is already registered (no duplicates allowed)
     */
    function registerCode(string memory hash, string memory metadata) public {
        require(!registrations[hash].exists, "Code hash already registered");
        require(bytes(hash).length > 0, "Hash cannot be empty");
        require(bytes(metadata).length > 0, "Metadata cannot be empty");

        // Create new registration entry
        registrations[hash] = Registration({
            author: msg.sender,
            timestamp: block.timestamp,
            metadata: metadata,
            exists: true
        });

        // Add to registered hashes array
        registeredHashes.push(hash);

        // Emit event for off-chain indexing
        emit CodeRegistered(hash, msg.sender, block.timestamp, metadata);
    }

    /**
     * @dev Verify code ownership by hash
     * @param hash The SHA-256 hash of the code to verify
     * Returns the author's address, timestamp, and metadata if registration exists
     * Returns zero address if registration not found
     */
    function verifyCode(string memory hash)
        public
        view
        returns (
            address author,
            uint256 timestamp,
            string memory metadata
        )
    {
        require(registrations[hash].exists, "Code hash not found");

        Registration memory reg = registrations[hash];
        return (reg.author, reg.timestamp, reg.metadata);
    }

    /**
     * @dev Check if a code hash has been registered
     * @param hash The SHA-256 hash to check
     * Returns true if registered, false otherwise
     */
    function isCodeRegistered(string memory hash) public view returns (bool) {
        return registrations[hash].exists;
    }

    /**
     * @dev Get the total number of registered code hashes
     * @return The count of all registrations
     */
    function getRegistrationCount() public view returns (uint256) {
        return registeredHashes.length;
    }

    /**
     * @dev Get a registered hash by index (for pagination)
     * @param index The index in the registeredHashes array
     * Returns the hash string at that index
     */
    function getRegisteredHashByIndex(uint256 index)
        public
        view
        returns (string memory)
    {
        require(index < registeredHashes.length, "Index out of bounds");
        return registeredHashes[index];
    }
}
