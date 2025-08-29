# Universal Attributes

Every dotPipe tag supports shared attributes for dynamic behavior.

- **id**: REQUIRED, unique identifier.
- **inline**: Pipeline string for dynamic macros.
- **ajax**: Load remote resource.
- **insert**: Target element ID for AJAX results.
- **query**: Key=value pairs for requests.
- **callback / callback-class**: JS function or grouped callback.
- **modal**: Load JSON templates/modals.
- **file / directory**: File download attributes.
- **set / get / delete**: Manipulate element attributes.
- **x-toggle**: Toggle classes.
- **tool-tip / modal-tip**: Tooltips and JSON tooltips.
- **copy / remove / display**: Content utilities.
- **headers**: Custom HTTP headers.
- **form-class / action-class**: Group forms or triggers.
- **event**: Events to bind to element.
- **sources**: File list (carousel/cards).
- **tab**: Tab configuration.
- **login-page / registration-page / css-page**: Login-specific.
- **validate**: Checkout validation mode.
- **pages / count / percents / height / width**: Columns config.
- **delay / interval / file-order / file-index / mode**: Timed + carousel attributes.
- **turn / turn-index / boxes**: Carousel rotation.
- **sort / page-size / lazy-load**: CSV options.

Each can be combined in markup to build rich behaviors.
