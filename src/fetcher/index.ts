import { DONE } from "./readyState";
import { OK } from "./status";

const xmlHttpRequestFetcher = (url: string) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== DONE) return;
      // eslint-disable-next-line no-unused-expressions
      xhr.status === OK
        ? resolve(xhr.responseText)
        : // eslint-disable-next-line prefer-promise-reject-errors
          reject(`${xhr.status} ${xhr.statusText}`);
    };
    xhr.open("GET", url, true);
    xhr.send();
  });

export default xmlHttpRequestFetcher;
