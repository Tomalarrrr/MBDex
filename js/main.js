/*slider picture before and after*/

var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var BeerSlider = (function () {
    function BeerSlider(element) {
      var _ref =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$start = _ref.start,
        start = _ref$start === undefined ? "50" : _ref$start,
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === undefined ? "beer" : _ref$prefix;
      _classCallCheck(this, BeerSlider);
      this.start = parseInt(start)
        ? Math.min(100, Math.max(0, parseInt(start)))
        : 50;
      this.prefix = prefix;
      if (!element || element.children.length !== 2) {
        return;
      }
      this.element = element;
      this.revealContainer = this.element.children[1];
      if (this.revealContainer.children.length < 1) {
        return;
      }
      this.revealElement = this.revealContainer.children[0];
      this.range = this.addElement("input", {
        type: "range",
        class: this.prefix + "-range",
        "aria-label": "Percent of revealed content",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        "aria-valuenow": this.start,
        value: this.start,
        min: "0",
        max: "100"
      });
  
      this.handle = this.addElement("span", {
        class: this.prefix + "-handle"
      });
  
      this.onImagesLoad();
    }
    _createClass(BeerSlider, [
      {
        key: "init",
        value: function init() {
          this.element.classList.add(this.prefix + "-ready");
          this.setImgWidth();
          this.move();
          this.addListeners();
        }
      },
      {
        key: "loadingImg",
        value: function loadingImg(src) {
          return new Promise(function (resolve, reject) {
            if (!src) {
              resolve();
            }
            var img = new Image();
            img.onload = function () {
              return resolve();
            };
            img.onerror = function () {
              return reject();
            };
            img.src = src;
          });
        }
      },
      {
        key: "loadedBoth",
        value: function loadedBoth() {
          var mainImageSrc =
            this.element.children[0].src ||
            this.element.children[0].getAttribute("data-" + this.prefix + "-src");
          var revealImageSrc =
            this.revealElement.src ||
            this.revealElement.getAttribute("data-" + this.prefix + "-src");
          return Promise.all([
            this.loadingImg(mainImageSrc),
            this.loadingImg(revealImageSrc)
          ]);
        }
      },
      {
        key: "onImagesLoad",
        value: function onImagesLoad() {
          var _this = this;
          if (!this.revealElement) {
            return;
          }
          this.loadedBoth().then(
            function () {
              _this.init();
            },
            function () {
              console.error("Some errors occurred and images are not loaded.");
            }
          );
        }
      },
      {
        key: "addElement",
        value: function addElement(tag, attributes) {
          var el = document.createElement(tag);
          Object.keys(attributes).forEach(function (key) {
            el.setAttribute(key, attributes[key]);
          });
          this.element.appendChild(el);
          return el;
        }
      },
      {
        key: "setImgWidth",
        value: function setImgWidth() {
          this.revealElement.style.width = getComputedStyle(this.element)[
            "width"
          ];
        }
      },
      {
        key: "addListeners",
        value: function addListeners() {
          var _this2 = this;
          var eventTypes = ["input", "change"];
          eventTypes.forEach(function (i) {
            _this2.range.addEventListener(i, function () {
              _this2.move();
            });
          });
          window.addEventListener("resize", function () {
            _this2.setImgWidth();
          });
        }
      },
      {
        key: "move",
        value: function move() {
          this.revealContainer.style.width = this.range.value + "%";
          this.handle.style.left = this.range.value + "%";
          this.range.setAttribute("aria-valuenow", this.range.value);
        }
      }
    ]);
    return BeerSlider;
  })();
  
  new BeerSlider(document.getElementById("slider1"));


const $window = $(window);
const $body = $("body");

class Slideshow {
  constructor(userOptions = {}) {
    const defaultOptions = {
      $el: $(".slideshow"),
      showArrows: false,
      showPagination: true,
      duration: 10000,
      autoplay: true };


    let options = Object.assign({}, defaultOptions, userOptions);

    this.$el = options.$el;
    this.maxSlide = this.$el.find($(".js-slider-home-slide")).length;
    this.showArrows = this.maxSlide > 1 ? options.showArrows : false;
    this.showPagination = options.showPagination;
    this.currentSlide = 1;
    this.isAnimating = false;
    this.animationDuration = 1200;
    this.autoplaySpeed = options.duration;
    this.interval;
    this.$controls = this.$el.find(".js-slider-home-button");
    this.autoplay = this.maxSlide > 1 ? options.autoplay : false;

    this.$el.on("click", ".js-slider-home-next", event => this.nextSlide());
    this.$el.on("click", ".js-slider-home-prev", event => this.prevSlide());
    this.$el.on("click", ".js-pagination-item", event => {
      if (!this.isAnimating) {
        this.preventClick();
        this.goToSlide(event.target.dataset.slide);
      }
    });

    this.init();
  }

  init() {
    this.goToSlide(1);
    if (this.autoplay) {
      this.startAutoplay();
    }

    if (this.showPagination) {
      let paginationNumber = this.maxSlide;
      let pagination = '<div class="pagination"><div class="container">';

      for (let i = 0; i < this.maxSlide; i++) {
        let item = `<span class="pagination__item js-pagination-item ${
        i === 0 ? "is-current" : ""
        }" data-slide=${i + 1}>${i + 1}</span>`;
        pagination = pagination + item;
      }

      pagination = pagination + "</div></div>";

      this.$el.append(pagination);
    }
  }

  preventClick() {
    this.isAnimating = true;
    this.$controls.prop("disabled", true);
    clearInterval(this.interval);

    setTimeout(() => {
      this.isAnimating = false;
      this.$controls.prop("disabled", false);
      if (this.autoplay) {
        this.startAutoplay();
      }
    }, this.animationDuration);
  }

  goToSlide(index) {
    this.currentSlide = parseInt(index);

    if (this.currentSlide > this.maxSlide) {
      this.currentSlide = 1;
    }

    if (this.currentSlide === 0) {
      this.currentSlide = this.maxSlide;
    }

    const newCurrent = this.$el.find(
    '.js-slider-home-slide[data-slide="' + this.currentSlide + '"]');

    const newPrev =
    this.currentSlide === 1 ?
    this.$el.find(".js-slider-home-slide").last() :
    newCurrent.prev(".js-slider-home-slide");
    const newNext =
    this.currentSlide === this.maxSlide ?
    this.$el.find(".js-slider-home-slide").first() :
    newCurrent.next(".js-slider-home-slide");

    this.$el.
    find(".js-slider-home-slide").
    removeClass("is-prev is-next is-current");
    this.$el.find(".js-pagination-item").removeClass("is-current");

    if (this.maxSlide > 1) {
      newPrev.addClass("is-prev");
      newNext.addClass("is-next");
    }

    newCurrent.addClass("is-current");
    this.$el.
    find('.js-pagination-item[data-slide="' + this.currentSlide + '"]').
    addClass("is-current");
  }

  nextSlide() {
    this.preventClick();
    this.goToSlide(this.currentSlide + 1);
  }

  prevSlide() {
    this.preventClick();
    this.goToSlide(this.currentSlide - 1);
  }

  startAutoplay() {
    this.interval = setInterval(() => {
      if (!this.isAnimating) {
        this.nextSlide();
      }
    }, this.autoplaySpeed);
  }

  destroy() {
    this.$el.off();
  }}


(function () {
  let loaded = false;
  let maxLoad = 3000;

  function load() {
    const options = {
      showPagination: true };


    let slideShow = new Slideshow(options);
  }

  function addLoadClass() {
    $body.addClass("is-loaded");

    setTimeout(function () {
      $body.addClass("is-animated");
    }, 600);
  }

  $window.on("load", function () {
    if (!loaded) {
      loaded = true;
      load();
    }
  });

  setTimeout(function () {
    if (!loaded) {
      loaded = true;
      load();
    }
  }, maxLoad);

  addLoadClass();
})();


/*Ligths off Display vid*/
const buttonEl = document.querySelector('.button');
const overlayEl = document.querySelector('.overlay');

const turnOn = () => {
    overlayEl.style.display = 'block'
}
buttonEl.addEventListener('click', turnOn);

const turnOff = (e) => {
    if (e.target.matches('.overlay')) overlayEl.style.display = 'none';
}
window.addEventListener('click', turnOff);


