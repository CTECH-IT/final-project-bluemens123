// Put your JavaScript here
// piece class
function Piece(position, rank, name){
	this.position = position;
	this.rank     = rank;
	this.name     = name;
	this.color    = this.name.substring(0,5);
	this.img      = document.getElementById(this.name);
}

Piece.prototype.hasRank = function(rank){
	return this.rank == rank;
}

Piece.prototype.changePosition = function(position){
	this.position = parseInt(position);
}
