import biconomyABI from "../abi/biconomy.json";
import ERC721ACollectionABI from "../abi/ERC721ACollection.json";
import ERC1155CollectionABI from "../abi/ERC1155Collection.json";

export const fetchABIByType = (contractType) => {
    switch (contractType) {
        case "biconomy": {
            return biconomyABI;
        }

        case "ERC721ACollection": {
            return ERC721ACollectionABI;
        }

        case "ERC1155Collection": {
            return ERC1155CollectionABI;
        }

        default: {
            return;
        }
    }
};
