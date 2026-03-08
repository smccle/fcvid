const updateSys = {
    requestFileAccess: async function(handle, readWrite) {
        const options = {};
        if (readWrite) {
            options.mode = 'readwrite';
        }
        if ((await handle.queryPermission(options)) === 'granted') {
            return true;
        }
        if ((await handle.requestPermission(options)) === 'granted') {
            return true;
        }
        return false;
    },
    checkForUpdate: async function() {

    },
    updateFiles: async function(updateData) {
        
    }
}

// Unused for now