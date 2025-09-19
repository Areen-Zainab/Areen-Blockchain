package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Transaction represents a single transaction
type Transaction struct {
	Data string `json:"data"`
}

// MerkleNode represents a node in the Merkle tree
type MerkleNode struct {
	Left  *MerkleNode `json:"left,omitempty"`
	Right *MerkleNode `json:"right,omitempty"`
	Hash  string      `json:"hash"`
}

// Block represents a block in the blockchain
type Block struct {
	Index        int           `json:"index"`
	Timestamp    int64         `json:"timestamp"`
	Transactions []Transaction `json:"transactions"`
	PreviousHash string        `json:"previous_hash"`
	Hash         string        `json:"hash"`
	Nonce        int           `json:"nonce"`
	MerkleRoot   string        `json:"merkle_root"`
}

// Blockchain represents the entire blockchain
type Blockchain struct {
	Chain       []Block       `json:"chain"`
	Difficulty  int           `json:"difficulty"`
	PendingTxns []Transaction `json:"pending_transactions"`
}

// Global blockchain instance
var blockchain *Blockchain

// InitBlockchain initializes a new blockchain with genesis block
func InitBlockchain() *Blockchain {
	bc := &Blockchain{
		Chain:       make([]Block, 0),
		Difficulty:  4, // Adjustable difficulty
		PendingTxns: make([]Transaction, 0),
	}

	// Create genesis block
	genesisBlock := Block{
		Index:        0,
		Timestamp:    time.Now().Unix(),
		Transactions: []Transaction{{Data: "Genesis Block"}},
		PreviousHash: "0",
		Nonce:        0,
	}

	// Calculate merkle root for genesis block
	genesisBlock.MerkleRoot = calculateMerkleRoot(genesisBlock.Transactions)

	// Mine genesis block
	bc.mineBlock(&genesisBlock)
	bc.Chain = append(bc.Chain, genesisBlock)

	return bc
}

// calculateHash calculates the SHA256 hash of a block
func calculateHash(block Block) string {
	data := fmt.Sprintf("%d%d%s%s%s%d",
		block.Index,
		block.Timestamp,
		block.MerkleRoot,
		block.PreviousHash,
		transactionsToString(block.Transactions),
		block.Nonce)

	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// transactionsToString converts transactions slice to string
func transactionsToString(transactions []Transaction) string {
	var result strings.Builder
	for _, tx := range transactions {
		result.WriteString(tx.Data)
	}
	return result.String()
}

// calculateMerkleRoot calculates the Merkle root of transactions
func calculateMerkleRoot(transactions []Transaction) string {
	if len(transactions) == 0 {
		return ""
	}

	// Create leaf nodes
	var nodes []*MerkleNode
	for _, tx := range transactions {
		hash := sha256.Sum256([]byte(tx.Data))
		node := &MerkleNode{
			Hash: hex.EncodeToString(hash[:]),
		}
		nodes = append(nodes, node)
	}

	// Build the tree
	for len(nodes) > 1 {
		var nextLevel []*MerkleNode

		for i := 0; i < len(nodes); i += 2 {
			var left, right *MerkleNode
			left = nodes[i]

			if i+1 < len(nodes) {
				right = nodes[i+1]
			} else {
				// Odd number of nodes, duplicate the last one
				right = nodes[i]
			}

			// Create parent node
			parentData := left.Hash + right.Hash
			parentHash := sha256.Sum256([]byte(parentData))

			parent := &MerkleNode{
				Left:  left,
				Right: right,
				Hash:  hex.EncodeToString(parentHash[:]),
			}

			nextLevel = append(nextLevel, parent)
		}
		nodes = nextLevel
	}

	return nodes[0].Hash
}

// mineBlock performs proof of work mining on a block
func (bc *Blockchain) mineBlock(block *Block) {
	target := strings.Repeat("0", bc.Difficulty)

	for {
		block.Hash = calculateHash(*block)
		if strings.HasPrefix(block.Hash, target) {
			fmt.Printf("Block mined: %s\n", block.Hash)
			break
		}
		block.Nonce++
	}
}

// AddTransaction adds a new transaction to pending transactions
func (bc *Blockchain) AddTransaction(data string) {
	transaction := Transaction{Data: data}
	bc.PendingTxns = append(bc.PendingTxns, transaction)
}

// MineNewBlock mines a new block with pending transactions
func (bc *Blockchain) MineNewBlock() Block {
	if len(bc.PendingTxns) == 0 {
		bc.AddTransaction("No transactions - empty block")
	}

	previousBlock := bc.Chain[len(bc.Chain)-1]

	newBlock := Block{
		Index:        previousBlock.Index + 1,
		Timestamp:    time.Now().Unix(),
		Transactions: bc.PendingTxns,
		PreviousHash: previousBlock.Hash,
		Nonce:        0,
	}

	// Calculate merkle root
	newBlock.MerkleRoot = calculateMerkleRoot(newBlock.Transactions)

	// Mine the block
	bc.mineBlock(&newBlock)

	// Add to chain and clear pending transactions
	bc.Chain = append(bc.Chain, newBlock)
	bc.PendingTxns = make([]Transaction, 0)

	return newBlock
}

// ValidateChain validates the integrity of the blockchain
func (bc *Blockchain) ValidateChain() bool {
	for i := 1; i < len(bc.Chain); i++ {
		currentBlock := bc.Chain[i]
		previousBlock := bc.Chain[i-1]

		// Validate current block hash
		if currentBlock.Hash != calculateHash(currentBlock) {
			return false
		}

		// Validate previous hash reference
		if currentBlock.PreviousHash != previousBlock.Hash {
			return false
		}
	}
	return true
}

// SearchData searches for specific data across all blocks
func (bc *Blockchain) SearchData(query string) []map[string]interface{} {
	var results []map[string]interface{}

	for _, block := range bc.Chain {
		for _, tx := range block.Transactions {
			if strings.Contains(strings.ToLower(tx.Data), strings.ToLower(query)) {
				result := map[string]interface{}{
					"block_index": block.Index,
					"block_hash":  block.Hash,
					"transaction": tx.Data,
					"timestamp":   block.Timestamp,
				}
				results = append(results, result)
			}
		}
	}

	return results
}

// HTTP Handlers

// GetBlockchain returns the complete blockchain
func getBlockchainHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blockchain)
}

// AddTransaction adds a new transaction
func addTransactionHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Data string `json:"data"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Data == "" {
		http.Error(w, "Transaction data cannot be empty", http.StatusBadRequest)
		return
	}

	blockchain.AddTransaction(req.Data)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":              true,
		"message":              "Transaction added to pending pool",
		"pending_transactions": len(blockchain.PendingTxns),
	})
}

// MineBlock mines a new block
func mineBlockHandler(w http.ResponseWriter, r *http.Request) {
	newBlock := blockchain.MineNewBlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Block mined successfully",
		"block":   newBlock,
	})
}

// SearchData searches for data in the blockchain
func searchDataHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	results := blockchain.SearchData(query)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"query":   query,
		"results": results,
	})
}

// ValidateChain validates the blockchain integrity
func validateChainHandler(w http.ResponseWriter, r *http.Request) {
	isValid := blockchain.ValidateChain()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"valid":   isValid,
		"message": fmt.Sprintf("Blockchain is valid: %t", isValid),
	})
}

// GetStats returns blockchain statistics
func getStatsHandler(w http.ResponseWriter, r *http.Request) {
	stats := map[string]interface{}{
		"total_blocks":         len(blockchain.Chain),
		"pending_transactions": len(blockchain.PendingTxns),
		"difficulty":           blockchain.Difficulty,
		"is_valid":             blockchain.ValidateChain(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// SetDifficulty updates mining difficulty
func setDifficultyHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Difficulty int `json:"difficulty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Difficulty < 1 || req.Difficulty > 6 {
		http.Error(w, "Difficulty must be between 1 and 6", http.StatusBadRequest)
		return
	}

	blockchain.Difficulty = req.Difficulty

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"message":    "Difficulty updated",
		"difficulty": blockchain.Difficulty,
	})
}

func main() {
	// Initialize blockchain
	blockchain = InitBlockchain()
	fmt.Println("Blockchain initialized with genesis block")

	// Setup routes
	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/blockchain", getBlockchainHandler).Methods("GET")
	api.HandleFunc("/transaction", addTransactionHandler).Methods("POST")
	api.HandleFunc("/mine", mineBlockHandler).Methods("POST")
	api.HandleFunc("/search", searchDataHandler).Methods("GET")
	api.HandleFunc("/validate", validateChainHandler).Methods("GET")
	api.HandleFunc("/stats", getStatsHandler).Methods("GET")
	api.HandleFunc("/difficulty", setDifficultyHandler).Methods("POST")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // React default port
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(router)

	port := ":8080"
	fmt.Printf("Blockchain server starting on port %s\n", port)
	fmt.Println("API Endpoints:")
	fmt.Println("  GET  /api/blockchain  - Get complete blockchain")
	fmt.Println("  POST /api/transaction - Add new transaction")
	fmt.Println("  POST /api/mine        - Mine new block")
	fmt.Println("  GET  /api/search      - Search data")
	fmt.Println("  GET  /api/validate    - Validate chain")
	fmt.Println("  GET  /api/stats       - Get statistics")
	fmt.Println("  POST /api/difficulty  - Set difficulty")

	log.Fatal(http.ListenAndServe(port, handler))
}
