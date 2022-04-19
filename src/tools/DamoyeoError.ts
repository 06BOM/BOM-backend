export class DamoyeoError extends Error { 
	public status: number;
	
	constructor(message: string, status = 500) {
	  super();
  
	  this.message = message;
	  this.status = status;
	}
  }