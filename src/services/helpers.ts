/**
 * @module Services
 */
export class HelperService {
  getParameterByName(name, link = null) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(
      !link ? window.location.search : link
    );

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  async clearCache() {
    return (await caches.keys()).forEach(c => caches.delete(c));
  }

  formatUSD(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });

    return formatter.format(amount ? amount : 0);
  }

  closestByClass(el, selector) {
    while (el.className !== selector) {
      el = el.parentNode;
      if (!el) {
        return null;
      }
    }

    return el;
  }

  closestByTag(el, selector) {
    while (el.tagName.toLowerCase() !== selector.toLowerCase()) {
      el = el.parentNode;
      if (!el) {
        return null;
      }
    }

    return el;
  }

  checkIsWordOrDigit(inputValue: string) {
    const filledRegEx = /[a-zA-Z0-9]/g;

    return filledRegEx.test(inputValue);
  }

  addOnceEventListener(element, event, func, capture) {
    function callMeOnce(e) {
      func(e);
      element.removeEventListener(event, callMeOnce, capture);
    }
    element.addEventListener(event, callMeOnce, capture);
  }

  setByPath(obj, path, value) {
    const pList = path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      const elem = pList[i];
      if (!obj[elem]) {
        obj[elem] = {};
      }
      obj = obj[elem];
    }

    obj[pList[len - 1]] = value;
  }

  simulateClick(el) {
    let evt;
    if (document.createEvent) {
      evt = document.createEvent('MouseEvents');
      evt.initMouseEvent(
        'click',
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
    }
    evt ? el.dispatchEvent(evt) : el.click && el.click();
  }

  forceBrowserResize() {
    window.dispatchEvent(new Event('resize'));
  }

  checkPhoneValidity(inputValue: string) {
    const telRexEx = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

    return telRexEx.test(inputValue);
  }

  checkEmailValidity(inputValue: string) {
    const emailRexEx = /(.+)@(.+){2,}\.(.+){2,}/;

    return emailRexEx.test(inputValue);
  }
}
