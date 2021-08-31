/**
 * AutoIncrement is an incremental int to identify each object
 */
const AutoIncrement = (() => {
    let _id = 0;

    return {
        getId() {
            _id++;
            return _id;
        }
    }
})();

export default AutoIncrement;