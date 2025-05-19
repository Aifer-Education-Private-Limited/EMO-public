self.onmessage = async (e) => {
    const { url, body } = e.data;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            self.postMessage({ type: 'error', error: `HTTP ${res.status}` });
            return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let done = false;
        let newLineTracker;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (readerDone) {
                self.postMessage({ type: 'done' });
                break;
            }

            buffer += decoder.decode(value || new Uint8Array(), { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (let line of lines) {
                line = line.trim();

                // console.log(line);

                // let content = line;
                // if (content.startsWith('data: ')) {
                    let content = line.slice(6); // remove "data:" and keep space only if in text
                // }

                // console.log(content);
                

                if (content === '[DONE]') {
                    self.postMessage({ type: 'done' });
                    done = true;
                    break;
                }

                // console.log(content);

                if (content === "") {
                    if (newLineTracker === "") {
                        content = "\n\n";
                        newLineTracker = undefined;
                    } else {
                        newLineTracker = "";
                    }
                } else {
                    newLineTracker = undefined;
                }

                self.postMessage({ type: 'data', chunk: content });
            }
        }
    } catch (err) {
        self.postMessage({ type: 'error', error: err.message });
    }
};


export { }
