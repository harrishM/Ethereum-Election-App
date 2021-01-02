pragma solidity ^0.5.16;

contract final_proj {
    struct Candidate {
        uint id;
        string name;
        string constituency;
        string party;
        uint voteCount;
    }

    mapping(address => bool) public voters;

    Candidate[] public candidates;
    uint public candidatesCount;

    event votedEvent (
        uint indexed _candidateId
    );

    constructor() public {
        addCandidate("Harrish","New York","democrat");
        addCandidate("Poojitha","Florida","republic");
    }

    function addCandidate (string memory _name,string memory _cons,string memory _party) public {

        if(candidatesCount<2){
        candidates.push(Candidate({
            id: candidatesCount++,
            name: "Harrish",
            constituency: "New York",
            party: "Democrat",
            voteCount: 0

        }));
            candidates.push(Candidate({
            id: candidatesCount++,
            name: "Pojitha",
            constituency: "Florida",
            party: "Republic",
            voteCount: 0

        }));


        }


    }

    function vote (uint id) public returns (string memory){


        voters[msg.sender] = true;

        addVote(id);

        emit votedEvent(id);

        return candidates[id].name;
    }


    function addVote(uint id) public {
        candidates[id].voteCount++;

    }


    function winner() public returns(string memory){
        string memory current_highest;
        uint largest = 0; 

         for(uint i = 0; i < candidates.length; i++){
            if(candidates[i].voteCount > largest) {
                largest = candidates[i].voteCount;
                current_highest = candidates[i].name;
            } 
        }

        return current_highest;

    }
}