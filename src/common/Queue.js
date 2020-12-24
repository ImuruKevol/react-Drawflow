function Queue() {
    this.queue = [];
    this.run = false;
    this.id = setInterval(async () => {
        if(this.isEmpty()) this.run = false;
        console.log(this.run)
        if(!this.run) return;
        const { job, args, callback } = this.pop();
        callback(await job(...args));
        this.pop();
    }, 250);
}

Queue.prototype.push = function(job, args, callback) {
    this.queue.push({job, args, callback});
    this.run = true;
}

Queue.prototype.pop = function() {
    const result = this.queue[0];
    this.queue = [...this.queue.slice(1)];
    if(this.isEmpty()) this.run = false;
    return result;
}

Queue.prototype.clear = function() {
    this.queue = [];
    // this.run = false;
}

Queue.prototype.isEmpty = function() {
    return this.queue.length === 0;
}

Queue.prototype.exit = function() {
    clearInterval(this.id);
}

String.prototype.asdf = function() {

}

export default new Queue();
