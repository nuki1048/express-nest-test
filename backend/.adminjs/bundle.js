(function (React, designSystem, PropTypes) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);
  var PropTypes__default = /*#__PURE__*/_interopDefault(PropTypes);

  const LINK_KEYS = ['facebook', 'instagram', 'airbnb', 'booking', 'whatsapp'];

  const LABELS$1 = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    airbnb: 'Airbnb',
    booking: 'Booking.com',
    whatsapp: 'WhatsApp'
  };
  function parseLinks(value) {
    if (value == null) return {};
    if (typeof value === 'object' && !Array.isArray(value)) {
      const obj = value;
      return LINK_KEYS.reduce((acc, key) => {
        const v = obj[key];
        acc[key] = typeof v === 'string' ? v : '';
        return acc;
      }, {});
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return parseLinks(parsed);
      } catch {
        return {};
      }
    }
    return {};
  }

  /** Get links from record.params: supports nested (params.links) or flattened (params['links.facebook']). */
  function getLinksFromParams(params, path) {
    if (!params) return {};
    const nested = params[path];
    if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
      return parseLinks(nested);
    }
    const prefix = `${path}.`;
    return LINK_KEYS.reduce((acc, key) => {
      const v = params[`${prefix}${key}`];
      acc[key] = typeof v === 'string' ? v : '';
      return acc;
    }, {});
  }

  function useLinksField(props) {
    const {
      property,
      record,
      onChange
    } = props;
    const path = property.path;
    const params = record?.params;
    const links = getLinksFromParams(params, path);
    const handleChange = (key, value) => {
      if (!onChange) return;
      onChange(path, {
        ...links,
        [key]: value
      });
    };
    return {
      path,
      links,
      handleChange
    };
  }

  function LinkItemEdit({
    path,
    linkKey,
    value,
    onChange
  }) {
    const id = `${path}-${linkKey}`;
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      htmlFor: id
    }, LABELS$1[linkKey]), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      id: id,
      value: value,
      onChange: e => onChange(linkKey, e.target.value),
      placeholder: `https://${linkKey}.com/...`
    }));
  }
  function LinkItemShow({
    linkKey,
    value
  }) {
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, LABELS$1[linkKey]), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "sm"
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: value,
      target: "_blank",
      rel: "noopener noreferrer"
    }, value)));
  }

  const LinksField = props => {
    const {
      where
    } = props;
    const {
      path,
      links,
      handleChange
    } = useLinksField(props);
    if (where === 'edit') {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, LINK_KEYS.map(key => /*#__PURE__*/React__default.default.createElement(LinkItemEdit, {
        key: key,
        path: path,
        linkKey: key,
        value: links[key] ?? '',
        onChange: handleChange
      })));
    }
    if (where === 'show' || where === 'list') {
      const filled = LINK_KEYS.filter(k => links[k]);
      if (filled.length === 0) return null;
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, filled.map(key => /*#__PURE__*/React__default.default.createElement(LinkItemShow, {
        key: key,
        linkKey: key,
        value: links[key] ?? ''
      })));
    }
    return null;
  };

  const DEFAULT_ADDRESS = {
    label: '',
    url: ''
  };
  function parseAddress(value) {
    if (value == null) return {
      ...DEFAULT_ADDRESS
    };
    if (typeof value === 'object' && !Array.isArray(value)) {
      const obj = value;
      return {
        label: typeof obj.label === 'string' ? obj.label : '',
        url: typeof obj.url === 'string' ? obj.url : ''
      };
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return parseAddress(parsed);
      } catch {
        return {
          ...DEFAULT_ADDRESS
        };
      }
    }
    return {
      ...DEFAULT_ADDRESS
    };
  }

  /** Get address from record.params: supports nested or flattened keys. */
  function getAddressFromParams(params, path) {
    if (!params) return {
      ...DEFAULT_ADDRESS
    };
    const nested = params[path];
    if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
      return parseAddress(nested);
    }
    return {
      label: typeof params[`${path}.label`] === 'string' ? params[`${path}.label`] : '',
      url: typeof params[`${path}.url`] === 'string' ? params[`${path}.url`] : ''
    };
  }

  function useAddressField(props) {
    const {
      property,
      record,
      onChange
    } = props;
    const path = property.path;
    const params = record?.params;
    const address = getAddressFromParams(params, path);
    const handleChange = (field, value) => {
      if (!onChange) return;
      onChange(path, {
        ...address,
        [field]: value
      });
    };
    return {
      path,
      address,
      handleChange
    };
  }

  const AddressField = props => {
    const {
      where
    } = props;
    const {
      path,
      address,
      handleChange
    } = useAddressField(props);
    if (where === 'edit') {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
        mb: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
        htmlFor: `${path}-label`
      }, "Label"), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
        id: `${path}-label`,
        value: address.label,
        onChange: e => handleChange('label', e.target.value),
        placeholder: "e.g. Kyiv, vul. Khreshchatyk 1"
      })), /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
        mb: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
        htmlFor: `${path}-url`
      }, "URL"), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
        id: `${path}-url`,
        value: address.url,
        onChange: e => handleChange('url', e.target.value),
        placeholder: "https://maps.example.com/..."
      })));
    }
    if (where === 'show' || where === 'list') {
      const hasValue = address.label || address.url;
      if (!hasValue) return null;
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, address.label && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mb: "default"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Label"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mt: "sm"
      }, address.label)), address.url && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mb: "default"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "URL"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mt: "sm"
      }, /*#__PURE__*/React__default.default.createElement("a", {
        href: address.url,
        target: "_blank",
        rel: "noopener noreferrer"
      }, address.url))));
    }
    return null;
  };

  const BUCKET = 'apartments';

  /** Public labels for the field. */
  const LABELS = {
    mainPhoto: 'Main photo',
    photos: 'Photos (multiple)'
  };
  const UPLOAD_URL = '/api/upload';
  const DEFAULT_SAVE_FIRST_MESSAGE = 'Save the record first so files are stored in its folder.';
  const UPLOAD_ERROR_FALLBACK = 'Upload failed';

  /** MIME type to extensions map for react-dropzone accept. */
  const IMAGE_ACCEPT_MAP = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif']
  };

  /** Thumbnail size in px; used for grid and card width. */
  const THUMB_SIZE = 160;

  /** Grid layout for thumbnail lists (edit and show). */
  const THUMB_GRID_STYLE = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12
  };

  /** Preview image style while files are uploading. */
  const UPLOADING_PREVIEW_STYLE = {
    maxHeight: 200,
    objectFit: 'contain'
  };

  // --- Params / record helpers ---

  /**
   * Read image URL(s) from record params.
   * Accepts params[path] as array or string, and params[path.0], params[path.1], …
   * for legacy form payloads.
   */
  function getUrlsFromParams(params, path, isMultiple) {
    if (isMultiple) return getArrayFromParams(params, path);
    const v = params?.[path];
    return typeof v === 'string' && v ? [v] : [];
  }
  function getRecordId(record) {
    const params = record?.params;
    return typeof params?.id === 'string' ? params.id : undefined;
  }
  function ensureStringArray(value) {
    if (Array.isArray(value)) {
      return value.filter(v => typeof v === 'string');
    }
    if (typeof value === 'string' && value) return [value];
    return [];
  }
  function getArrayFromParams(params, path) {
    if (!params) return [];
    const direct = params[path];
    if (Array.isArray(direct)) {
      return ensureStringArray(direct);
    }
    const collected = [];
    let i = 0;
    for (;;) {
      const key = `${path}.${i}`;
      const v = params[key];
      if (v === undefined || v === null) break;
      if (typeof v === 'string' && v) collected.push(v);
      i += 1;
    }
    return collected;
  }

  // --- Path and error helpers ---

  function buildUploadPath(uploadPathPrefix, recordId) {
    if (!uploadPathPrefix || typeof uploadPathPrefix !== 'string') return null;
    const segment = (recordId?.trim() || '_new').replace(/[^a-zA-Z0-9_.-]/g, '');
    const prefix = uploadPathPrefix.trim().replace(/[^a-zA-Z0-9_.-]/g, '');
    return prefix ? `${prefix}/${segment}` : null;
  }
  function getErrorMessage(err, fallback = UPLOAD_ERROR_FALLBACK) {
    return err instanceof Error ? err.message : fallback;
  }

  // --- Upload (single helper) ---

  async function uploadFile(file, uploadPath) {
    const url = new URL(UPLOAD_URL, window.location.origin);
    if (uploadPath) {
      url.searchParams.set('path', uploadPath);
    }
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({
        message: res.statusText
      }));
      throw new Error(err.message ?? 'Upload failed');
    }
    const data = await res.json();
    return data.url;
  }

  /**
   * Extract storage key from a Supabase public URL.
   * URL format: .../storage/v1/object/public/<bucket>/<key>
   */
  function getStorageKeyFromPublicUrl(url) {
    try {
      const pathname = new URL(url).pathname;
      const prefix = `/storage/v1/object/public/${BUCKET}/`;
      if (!pathname.startsWith(prefix)) return null;
      return pathname.slice(prefix.length) || null;
    } catch {
      return null;
    }
  }

  /**
   * Delete a file from storage by its public URL (only works for Supabase public URLs for our bucket).
   * No-op if the URL is not a valid storage URL (e.g. blob URL).
   */
  async function deleteFileByUrl(url) {
    const key = getStorageKeyFromPublicUrl(url);
    if (!key) return;
    const deleteUrl = new URL(UPLOAD_URL, window.location.origin);
    deleteUrl.searchParams.set('path', key);
    const res = await fetch(deleteUrl.toString(), {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({
        message: res.statusText
      }));
      throw new Error(err.message ?? 'Delete failed');
    }
  }

  /**
   * Upload files and return the next value for the field: single URL or array of URLs appended to currentUrls.
   */
  async function uploadFilesAndBuildNextValue(files, uploadPath, isMultiple, currentUrls) {
    const list = Array.from(files);
    if (list.length === 0) {
      return isMultiple ? currentUrls : '';
    }
    const urls = [];
    for (let i = 0; i < list.length; i++) {
      urls.push(await uploadFile(list[i], uploadPath));
    }
    if (isMultiple) {
      return [...currentUrls, ...urls];
    }
    return urls[0];
  }

  /**
   * Build field config from AdminJS property.
   * Multiple upload is enabled when path is "photos" (used for apartment photos).
   */
  function getFieldConfig(property) {
    return {
      path: property.path,
      isMultiple: property.path === 'photos',
      uploadPathPrefix: property.custom?.uploadPathPrefix,
      saveFirstMessage: property.custom?.saveFirstMessage ?? DEFAULT_SAVE_FIRST_MESSAGE
    };
  }

  function useImageUploadField(props) {
    const {
      property,
      record,
      onChange
    } = props;
    const config = getFieldConfig(property);
    const params = record?.params;
    const recordId = getRecordId(record);
    const uploadPath = buildUploadPath(config.uploadPathPrefix, recordId);
    const urls = getUrlsFromParams(params, config.path, config.isMultiple);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [uploadingFiles, setUploadingFiles] = React.useState([]);
    const handleFiles = async files => {
      if (!files.length || !onChange) return;
      setError(null);
      setUploading(true);
      setUploadingFiles(files);
      try {
        const nextValue = await uploadFilesAndBuildNextValue(files, uploadPath, config.isMultiple, urls);
        onChange(config.path, nextValue);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setUploading(false);
        setUploadingFiles([]);
      }
    };
    const removeUrl = index => {
      if (!onChange) return;
      const urlToRemove = urls[index];
      if (urlToRemove) {
        void deleteFileByUrl(urlToRemove).catch(() => {
          // Fire-and-forget: image is removed from form either way
        });
      }
      if (config.isMultiple) {
        const next = urls.filter((_, i) => i !== index);
        onChange(config.path, next);
      } else {
        onChange(config.path, '');
      }
    };
    return {
      field: {
        path: config.path,
        isMultiple: config.isMultiple,
        urls,
        uploadingFiles,
        uploadPath,
        uploadPathPrefix: config.uploadPathPrefix,
        recordId,
        saveFirstMessage: config.saveFirstMessage
      },
      status: {
        uploading,
        error
      },
      actions: {
        handleFiles,
        removeUrl
      }
    };
  }

  /**
   * Returns object URLs for the given files and revokes them on cleanup.
   * Use for previewing File objects before upload.
   */
  function useObjectUrls(files) {
    const [urls, setUrls] = React.useState([]);
    React.useEffect(() => {
      if (files.length === 0) {
        setUrls([]);
        return;
      }
      const next = files.map(f => URL.createObjectURL(f));
      setUrls(next);
      return () => next.forEach(url => URL.revokeObjectURL(url));
    }, [files]);
    return urls;
  }

  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var dist$1 = {};

  var fileSelector = {};

  var file = {};

  (function (exports$1) {
  	Object.defineProperty(exports$1, "__esModule", { value: true });
  	exports$1.COMMON_MIME_TYPES = void 0;
  	exports$1.toFileWithPath = toFileWithPath;
  	exports$1.COMMON_MIME_TYPES = new Map([
  	    // https://github.com/guzzle/psr7/blob/2d9260799e713f1c475d3c5fdc3d6561ff7441b2/src/MimeType.php
  	    ['1km', 'application/vnd.1000minds.decision-model+xml'],
  	    ['3dml', 'text/vnd.in3d.3dml'],
  	    ['3ds', 'image/x-3ds'],
  	    ['3g2', 'video/3gpp2'],
  	    ['3gp', 'video/3gp'],
  	    ['3gpp', 'video/3gpp'],
  	    ['3mf', 'model/3mf'],
  	    ['7z', 'application/x-7z-compressed'],
  	    ['7zip', 'application/x-7z-compressed'],
  	    ['123', 'application/vnd.lotus-1-2-3'],
  	    ['aab', 'application/x-authorware-bin'],
  	    ['aac', 'audio/x-acc'],
  	    ['aam', 'application/x-authorware-map'],
  	    ['aas', 'application/x-authorware-seg'],
  	    ['abw', 'application/x-abiword'],
  	    ['ac', 'application/vnd.nokia.n-gage.ac+xml'],
  	    ['ac3', 'audio/ac3'],
  	    ['acc', 'application/vnd.americandynamics.acc'],
  	    ['ace', 'application/x-ace-compressed'],
  	    ['acu', 'application/vnd.acucobol'],
  	    ['acutc', 'application/vnd.acucorp'],
  	    ['adp', 'audio/adpcm'],
  	    ['aep', 'application/vnd.audiograph'],
  	    ['afm', 'application/x-font-type1'],
  	    ['afp', 'application/vnd.ibm.modcap'],
  	    ['ahead', 'application/vnd.ahead.space'],
  	    ['ai', 'application/pdf'],
  	    ['aif', 'audio/x-aiff'],
  	    ['aifc', 'audio/x-aiff'],
  	    ['aiff', 'audio/x-aiff'],
  	    ['air', 'application/vnd.adobe.air-application-installer-package+zip'],
  	    ['ait', 'application/vnd.dvb.ait'],
  	    ['ami', 'application/vnd.amiga.ami'],
  	    ['amr', 'audio/amr'],
  	    ['apk', 'application/vnd.android.package-archive'],
  	    ['apng', 'image/apng'],
  	    ['appcache', 'text/cache-manifest'],
  	    ['application', 'application/x-ms-application'],
  	    ['apr', 'application/vnd.lotus-approach'],
  	    ['arc', 'application/x-freearc'],
  	    ['arj', 'application/x-arj'],
  	    ['asc', 'application/pgp-signature'],
  	    ['asf', 'video/x-ms-asf'],
  	    ['asm', 'text/x-asm'],
  	    ['aso', 'application/vnd.accpac.simply.aso'],
  	    ['asx', 'video/x-ms-asf'],
  	    ['atc', 'application/vnd.acucorp'],
  	    ['atom', 'application/atom+xml'],
  	    ['atomcat', 'application/atomcat+xml'],
  	    ['atomdeleted', 'application/atomdeleted+xml'],
  	    ['atomsvc', 'application/atomsvc+xml'],
  	    ['atx', 'application/vnd.antix.game-component'],
  	    ['au', 'audio/x-au'],
  	    ['avi', 'video/x-msvideo'],
  	    ['avif', 'image/avif'],
  	    ['aw', 'application/applixware'],
  	    ['azf', 'application/vnd.airzip.filesecure.azf'],
  	    ['azs', 'application/vnd.airzip.filesecure.azs'],
  	    ['azv', 'image/vnd.airzip.accelerator.azv'],
  	    ['azw', 'application/vnd.amazon.ebook'],
  	    ['b16', 'image/vnd.pco.b16'],
  	    ['bat', 'application/x-msdownload'],
  	    ['bcpio', 'application/x-bcpio'],
  	    ['bdf', 'application/x-font-bdf'],
  	    ['bdm', 'application/vnd.syncml.dm+wbxml'],
  	    ['bdoc', 'application/x-bdoc'],
  	    ['bed', 'application/vnd.realvnc.bed'],
  	    ['bh2', 'application/vnd.fujitsu.oasysprs'],
  	    ['bin', 'application/octet-stream'],
  	    ['blb', 'application/x-blorb'],
  	    ['blorb', 'application/x-blorb'],
  	    ['bmi', 'application/vnd.bmi'],
  	    ['bmml', 'application/vnd.balsamiq.bmml+xml'],
  	    ['bmp', 'image/bmp'],
  	    ['book', 'application/vnd.framemaker'],
  	    ['box', 'application/vnd.previewsystems.box'],
  	    ['boz', 'application/x-bzip2'],
  	    ['bpk', 'application/octet-stream'],
  	    ['bpmn', 'application/octet-stream'],
  	    ['bsp', 'model/vnd.valve.source.compiled-map'],
  	    ['btif', 'image/prs.btif'],
  	    ['buffer', 'application/octet-stream'],
  	    ['bz', 'application/x-bzip'],
  	    ['bz2', 'application/x-bzip2'],
  	    ['c', 'text/x-c'],
  	    ['c4d', 'application/vnd.clonk.c4group'],
  	    ['c4f', 'application/vnd.clonk.c4group'],
  	    ['c4g', 'application/vnd.clonk.c4group'],
  	    ['c4p', 'application/vnd.clonk.c4group'],
  	    ['c4u', 'application/vnd.clonk.c4group'],
  	    ['c11amc', 'application/vnd.cluetrust.cartomobile-config'],
  	    ['c11amz', 'application/vnd.cluetrust.cartomobile-config-pkg'],
  	    ['cab', 'application/vnd.ms-cab-compressed'],
  	    ['caf', 'audio/x-caf'],
  	    ['cap', 'application/vnd.tcpdump.pcap'],
  	    ['car', 'application/vnd.curl.car'],
  	    ['cat', 'application/vnd.ms-pki.seccat'],
  	    ['cb7', 'application/x-cbr'],
  	    ['cba', 'application/x-cbr'],
  	    ['cbr', 'application/x-cbr'],
  	    ['cbt', 'application/x-cbr'],
  	    ['cbz', 'application/x-cbr'],
  	    ['cc', 'text/x-c'],
  	    ['cco', 'application/x-cocoa'],
  	    ['cct', 'application/x-director'],
  	    ['ccxml', 'application/ccxml+xml'],
  	    ['cdbcmsg', 'application/vnd.contact.cmsg'],
  	    ['cda', 'application/x-cdf'],
  	    ['cdf', 'application/x-netcdf'],
  	    ['cdfx', 'application/cdfx+xml'],
  	    ['cdkey', 'application/vnd.mediastation.cdkey'],
  	    ['cdmia', 'application/cdmi-capability'],
  	    ['cdmic', 'application/cdmi-container'],
  	    ['cdmid', 'application/cdmi-domain'],
  	    ['cdmio', 'application/cdmi-object'],
  	    ['cdmiq', 'application/cdmi-queue'],
  	    ['cdr', 'application/cdr'],
  	    ['cdx', 'chemical/x-cdx'],
  	    ['cdxml', 'application/vnd.chemdraw+xml'],
  	    ['cdy', 'application/vnd.cinderella'],
  	    ['cer', 'application/pkix-cert'],
  	    ['cfs', 'application/x-cfs-compressed'],
  	    ['cgm', 'image/cgm'],
  	    ['chat', 'application/x-chat'],
  	    ['chm', 'application/vnd.ms-htmlhelp'],
  	    ['chrt', 'application/vnd.kde.kchart'],
  	    ['cif', 'chemical/x-cif'],
  	    ['cii', 'application/vnd.anser-web-certificate-issue-initiation'],
  	    ['cil', 'application/vnd.ms-artgalry'],
  	    ['cjs', 'application/node'],
  	    ['cla', 'application/vnd.claymore'],
  	    ['class', 'application/octet-stream'],
  	    ['clkk', 'application/vnd.crick.clicker.keyboard'],
  	    ['clkp', 'application/vnd.crick.clicker.palette'],
  	    ['clkt', 'application/vnd.crick.clicker.template'],
  	    ['clkw', 'application/vnd.crick.clicker.wordbank'],
  	    ['clkx', 'application/vnd.crick.clicker'],
  	    ['clp', 'application/x-msclip'],
  	    ['cmc', 'application/vnd.cosmocaller'],
  	    ['cmdf', 'chemical/x-cmdf'],
  	    ['cml', 'chemical/x-cml'],
  	    ['cmp', 'application/vnd.yellowriver-custom-menu'],
  	    ['cmx', 'image/x-cmx'],
  	    ['cod', 'application/vnd.rim.cod'],
  	    ['coffee', 'text/coffeescript'],
  	    ['com', 'application/x-msdownload'],
  	    ['conf', 'text/plain'],
  	    ['cpio', 'application/x-cpio'],
  	    ['cpp', 'text/x-c'],
  	    ['cpt', 'application/mac-compactpro'],
  	    ['crd', 'application/x-mscardfile'],
  	    ['crl', 'application/pkix-crl'],
  	    ['crt', 'application/x-x509-ca-cert'],
  	    ['crx', 'application/x-chrome-extension'],
  	    ['cryptonote', 'application/vnd.rig.cryptonote'],
  	    ['csh', 'application/x-csh'],
  	    ['csl', 'application/vnd.citationstyles.style+xml'],
  	    ['csml', 'chemical/x-csml'],
  	    ['csp', 'application/vnd.commonspace'],
  	    ['csr', 'application/octet-stream'],
  	    ['css', 'text/css'],
  	    ['cst', 'application/x-director'],
  	    ['csv', 'text/csv'],
  	    ['cu', 'application/cu-seeme'],
  	    ['curl', 'text/vnd.curl'],
  	    ['cww', 'application/prs.cww'],
  	    ['cxt', 'application/x-director'],
  	    ['cxx', 'text/x-c'],
  	    ['dae', 'model/vnd.collada+xml'],
  	    ['daf', 'application/vnd.mobius.daf'],
  	    ['dart', 'application/vnd.dart'],
  	    ['dataless', 'application/vnd.fdsn.seed'],
  	    ['davmount', 'application/davmount+xml'],
  	    ['dbf', 'application/vnd.dbf'],
  	    ['dbk', 'application/docbook+xml'],
  	    ['dcr', 'application/x-director'],
  	    ['dcurl', 'text/vnd.curl.dcurl'],
  	    ['dd2', 'application/vnd.oma.dd2+xml'],
  	    ['ddd', 'application/vnd.fujixerox.ddd'],
  	    ['ddf', 'application/vnd.syncml.dmddf+xml'],
  	    ['dds', 'image/vnd.ms-dds'],
  	    ['deb', 'application/x-debian-package'],
  	    ['def', 'text/plain'],
  	    ['deploy', 'application/octet-stream'],
  	    ['der', 'application/x-x509-ca-cert'],
  	    ['dfac', 'application/vnd.dreamfactory'],
  	    ['dgc', 'application/x-dgc-compressed'],
  	    ['dic', 'text/x-c'],
  	    ['dir', 'application/x-director'],
  	    ['dis', 'application/vnd.mobius.dis'],
  	    ['disposition-notification', 'message/disposition-notification'],
  	    ['dist', 'application/octet-stream'],
  	    ['distz', 'application/octet-stream'],
  	    ['djv', 'image/vnd.djvu'],
  	    ['djvu', 'image/vnd.djvu'],
  	    ['dll', 'application/octet-stream'],
  	    ['dmg', 'application/x-apple-diskimage'],
  	    ['dmn', 'application/octet-stream'],
  	    ['dmp', 'application/vnd.tcpdump.pcap'],
  	    ['dms', 'application/octet-stream'],
  	    ['dna', 'application/vnd.dna'],
  	    ['doc', 'application/msword'],
  	    ['docm', 'application/vnd.ms-word.template.macroEnabled.12'],
  	    ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  	    ['dot', 'application/msword'],
  	    ['dotm', 'application/vnd.ms-word.template.macroEnabled.12'],
  	    ['dotx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
  	    ['dp', 'application/vnd.osgi.dp'],
  	    ['dpg', 'application/vnd.dpgraph'],
  	    ['dra', 'audio/vnd.dra'],
  	    ['drle', 'image/dicom-rle'],
  	    ['dsc', 'text/prs.lines.tag'],
  	    ['dssc', 'application/dssc+der'],
  	    ['dtb', 'application/x-dtbook+xml'],
  	    ['dtd', 'application/xml-dtd'],
  	    ['dts', 'audio/vnd.dts'],
  	    ['dtshd', 'audio/vnd.dts.hd'],
  	    ['dump', 'application/octet-stream'],
  	    ['dvb', 'video/vnd.dvb.file'],
  	    ['dvi', 'application/x-dvi'],
  	    ['dwd', 'application/atsc-dwd+xml'],
  	    ['dwf', 'model/vnd.dwf'],
  	    ['dwg', 'image/vnd.dwg'],
  	    ['dxf', 'image/vnd.dxf'],
  	    ['dxp', 'application/vnd.spotfire.dxp'],
  	    ['dxr', 'application/x-director'],
  	    ['ear', 'application/java-archive'],
  	    ['ecelp4800', 'audio/vnd.nuera.ecelp4800'],
  	    ['ecelp7470', 'audio/vnd.nuera.ecelp7470'],
  	    ['ecelp9600', 'audio/vnd.nuera.ecelp9600'],
  	    ['ecma', 'application/ecmascript'],
  	    ['edm', 'application/vnd.novadigm.edm'],
  	    ['edx', 'application/vnd.novadigm.edx'],
  	    ['efif', 'application/vnd.picsel'],
  	    ['ei6', 'application/vnd.pg.osasli'],
  	    ['elc', 'application/octet-stream'],
  	    ['emf', 'image/emf'],
  	    ['eml', 'message/rfc822'],
  	    ['emma', 'application/emma+xml'],
  	    ['emotionml', 'application/emotionml+xml'],
  	    ['emz', 'application/x-msmetafile'],
  	    ['eol', 'audio/vnd.digital-winds'],
  	    ['eot', 'application/vnd.ms-fontobject'],
  	    ['eps', 'application/postscript'],
  	    ['epub', 'application/epub+zip'],
  	    ['es', 'application/ecmascript'],
  	    ['es3', 'application/vnd.eszigno3+xml'],
  	    ['esa', 'application/vnd.osgi.subsystem'],
  	    ['esf', 'application/vnd.epson.esf'],
  	    ['et3', 'application/vnd.eszigno3+xml'],
  	    ['etx', 'text/x-setext'],
  	    ['eva', 'application/x-eva'],
  	    ['evy', 'application/x-envoy'],
  	    ['exe', 'application/octet-stream'],
  	    ['exi', 'application/exi'],
  	    ['exp', 'application/express'],
  	    ['exr', 'image/aces'],
  	    ['ext', 'application/vnd.novadigm.ext'],
  	    ['ez', 'application/andrew-inset'],
  	    ['ez2', 'application/vnd.ezpix-album'],
  	    ['ez3', 'application/vnd.ezpix-package'],
  	    ['f', 'text/x-fortran'],
  	    ['f4v', 'video/mp4'],
  	    ['f77', 'text/x-fortran'],
  	    ['f90', 'text/x-fortran'],
  	    ['fbs', 'image/vnd.fastbidsheet'],
  	    ['fcdt', 'application/vnd.adobe.formscentral.fcdt'],
  	    ['fcs', 'application/vnd.isac.fcs'],
  	    ['fdf', 'application/vnd.fdf'],
  	    ['fdt', 'application/fdt+xml'],
  	    ['fe_launch', 'application/vnd.denovo.fcselayout-link'],
  	    ['fg5', 'application/vnd.fujitsu.oasysgp'],
  	    ['fgd', 'application/x-director'],
  	    ['fh', 'image/x-freehand'],
  	    ['fh4', 'image/x-freehand'],
  	    ['fh5', 'image/x-freehand'],
  	    ['fh7', 'image/x-freehand'],
  	    ['fhc', 'image/x-freehand'],
  	    ['fig', 'application/x-xfig'],
  	    ['fits', 'image/fits'],
  	    ['flac', 'audio/x-flac'],
  	    ['fli', 'video/x-fli'],
  	    ['flo', 'application/vnd.micrografx.flo'],
  	    ['flv', 'video/x-flv'],
  	    ['flw', 'application/vnd.kde.kivio'],
  	    ['flx', 'text/vnd.fmi.flexstor'],
  	    ['fly', 'text/vnd.fly'],
  	    ['fm', 'application/vnd.framemaker'],
  	    ['fnc', 'application/vnd.frogans.fnc'],
  	    ['fo', 'application/vnd.software602.filler.form+xml'],
  	    ['for', 'text/x-fortran'],
  	    ['fpx', 'image/vnd.fpx'],
  	    ['frame', 'application/vnd.framemaker'],
  	    ['fsc', 'application/vnd.fsc.weblaunch'],
  	    ['fst', 'image/vnd.fst'],
  	    ['ftc', 'application/vnd.fluxtime.clip'],
  	    ['fti', 'application/vnd.anser-web-funds-transfer-initiation'],
  	    ['fvt', 'video/vnd.fvt'],
  	    ['fxp', 'application/vnd.adobe.fxp'],
  	    ['fxpl', 'application/vnd.adobe.fxp'],
  	    ['fzs', 'application/vnd.fuzzysheet'],
  	    ['g2w', 'application/vnd.geoplan'],
  	    ['g3', 'image/g3fax'],
  	    ['g3w', 'application/vnd.geospace'],
  	    ['gac', 'application/vnd.groove-account'],
  	    ['gam', 'application/x-tads'],
  	    ['gbr', 'application/rpki-ghostbusters'],
  	    ['gca', 'application/x-gca-compressed'],
  	    ['gdl', 'model/vnd.gdl'],
  	    ['gdoc', 'application/vnd.google-apps.document'],
  	    ['geo', 'application/vnd.dynageo'],
  	    ['geojson', 'application/geo+json'],
  	    ['gex', 'application/vnd.geometry-explorer'],
  	    ['ggb', 'application/vnd.geogebra.file'],
  	    ['ggt', 'application/vnd.geogebra.tool'],
  	    ['ghf', 'application/vnd.groove-help'],
  	    ['gif', 'image/gif'],
  	    ['gim', 'application/vnd.groove-identity-message'],
  	    ['glb', 'model/gltf-binary'],
  	    ['gltf', 'model/gltf+json'],
  	    ['gml', 'application/gml+xml'],
  	    ['gmx', 'application/vnd.gmx'],
  	    ['gnumeric', 'application/x-gnumeric'],
  	    ['gpg', 'application/gpg-keys'],
  	    ['gph', 'application/vnd.flographit'],
  	    ['gpx', 'application/gpx+xml'],
  	    ['gqf', 'application/vnd.grafeq'],
  	    ['gqs', 'application/vnd.grafeq'],
  	    ['gram', 'application/srgs'],
  	    ['gramps', 'application/x-gramps-xml'],
  	    ['gre', 'application/vnd.geometry-explorer'],
  	    ['grv', 'application/vnd.groove-injector'],
  	    ['grxml', 'application/srgs+xml'],
  	    ['gsf', 'application/x-font-ghostscript'],
  	    ['gsheet', 'application/vnd.google-apps.spreadsheet'],
  	    ['gslides', 'application/vnd.google-apps.presentation'],
  	    ['gtar', 'application/x-gtar'],
  	    ['gtm', 'application/vnd.groove-tool-message'],
  	    ['gtw', 'model/vnd.gtw'],
  	    ['gv', 'text/vnd.graphviz'],
  	    ['gxf', 'application/gxf'],
  	    ['gxt', 'application/vnd.geonext'],
  	    ['gz', 'application/gzip'],
  	    ['gzip', 'application/gzip'],
  	    ['h', 'text/x-c'],
  	    ['h261', 'video/h261'],
  	    ['h263', 'video/h263'],
  	    ['h264', 'video/h264'],
  	    ['hal', 'application/vnd.hal+xml'],
  	    ['hbci', 'application/vnd.hbci'],
  	    ['hbs', 'text/x-handlebars-template'],
  	    ['hdd', 'application/x-virtualbox-hdd'],
  	    ['hdf', 'application/x-hdf'],
  	    ['heic', 'image/heic'],
  	    ['heics', 'image/heic-sequence'],
  	    ['heif', 'image/heif'],
  	    ['heifs', 'image/heif-sequence'],
  	    ['hej2', 'image/hej2k'],
  	    ['held', 'application/atsc-held+xml'],
  	    ['hh', 'text/x-c'],
  	    ['hjson', 'application/hjson'],
  	    ['hlp', 'application/winhlp'],
  	    ['hpgl', 'application/vnd.hp-hpgl'],
  	    ['hpid', 'application/vnd.hp-hpid'],
  	    ['hps', 'application/vnd.hp-hps'],
  	    ['hqx', 'application/mac-binhex40'],
  	    ['hsj2', 'image/hsj2'],
  	    ['htc', 'text/x-component'],
  	    ['htke', 'application/vnd.kenameaapp'],
  	    ['htm', 'text/html'],
  	    ['html', 'text/html'],
  	    ['hvd', 'application/vnd.yamaha.hv-dic'],
  	    ['hvp', 'application/vnd.yamaha.hv-voice'],
  	    ['hvs', 'application/vnd.yamaha.hv-script'],
  	    ['i2g', 'application/vnd.intergeo'],
  	    ['icc', 'application/vnd.iccprofile'],
  	    ['ice', 'x-conference/x-cooltalk'],
  	    ['icm', 'application/vnd.iccprofile'],
  	    ['ico', 'image/x-icon'],
  	    ['ics', 'text/calendar'],
  	    ['ief', 'image/ief'],
  	    ['ifb', 'text/calendar'],
  	    ['ifm', 'application/vnd.shana.informed.formdata'],
  	    ['iges', 'model/iges'],
  	    ['igl', 'application/vnd.igloader'],
  	    ['igm', 'application/vnd.insors.igm'],
  	    ['igs', 'model/iges'],
  	    ['igx', 'application/vnd.micrografx.igx'],
  	    ['iif', 'application/vnd.shana.informed.interchange'],
  	    ['img', 'application/octet-stream'],
  	    ['imp', 'application/vnd.accpac.simply.imp'],
  	    ['ims', 'application/vnd.ms-ims'],
  	    ['in', 'text/plain'],
  	    ['ini', 'text/plain'],
  	    ['ink', 'application/inkml+xml'],
  	    ['inkml', 'application/inkml+xml'],
  	    ['install', 'application/x-install-instructions'],
  	    ['iota', 'application/vnd.astraea-software.iota'],
  	    ['ipfix', 'application/ipfix'],
  	    ['ipk', 'application/vnd.shana.informed.package'],
  	    ['irm', 'application/vnd.ibm.rights-management'],
  	    ['irp', 'application/vnd.irepository.package+xml'],
  	    ['iso', 'application/x-iso9660-image'],
  	    ['itp', 'application/vnd.shana.informed.formtemplate'],
  	    ['its', 'application/its+xml'],
  	    ['ivp', 'application/vnd.immervision-ivp'],
  	    ['ivu', 'application/vnd.immervision-ivu'],
  	    ['jad', 'text/vnd.sun.j2me.app-descriptor'],
  	    ['jade', 'text/jade'],
  	    ['jam', 'application/vnd.jam'],
  	    ['jar', 'application/java-archive'],
  	    ['jardiff', 'application/x-java-archive-diff'],
  	    ['java', 'text/x-java-source'],
  	    ['jhc', 'image/jphc'],
  	    ['jisp', 'application/vnd.jisp'],
  	    ['jls', 'image/jls'],
  	    ['jlt', 'application/vnd.hp-jlyt'],
  	    ['jng', 'image/x-jng'],
  	    ['jnlp', 'application/x-java-jnlp-file'],
  	    ['joda', 'application/vnd.joost.joda-archive'],
  	    ['jp2', 'image/jp2'],
  	    ['jpe', 'image/jpeg'],
  	    ['jpeg', 'image/jpeg'],
  	    ['jpf', 'image/jpx'],
  	    ['jpg', 'image/jpeg'],
  	    ['jpg2', 'image/jp2'],
  	    ['jpgm', 'video/jpm'],
  	    ['jpgv', 'video/jpeg'],
  	    ['jph', 'image/jph'],
  	    ['jpm', 'video/jpm'],
  	    ['jpx', 'image/jpx'],
  	    ['js', 'application/javascript'],
  	    ['json', 'application/json'],
  	    ['json5', 'application/json5'],
  	    ['jsonld', 'application/ld+json'],
  	    // https://jsonlines.org/
  	    ['jsonl', 'application/jsonl'],
  	    ['jsonml', 'application/jsonml+json'],
  	    ['jsx', 'text/jsx'],
  	    ['jxr', 'image/jxr'],
  	    ['jxra', 'image/jxra'],
  	    ['jxrs', 'image/jxrs'],
  	    ['jxs', 'image/jxs'],
  	    ['jxsc', 'image/jxsc'],
  	    ['jxsi', 'image/jxsi'],
  	    ['jxss', 'image/jxss'],
  	    ['kar', 'audio/midi'],
  	    ['karbon', 'application/vnd.kde.karbon'],
  	    ['kdb', 'application/octet-stream'],
  	    ['kdbx', 'application/x-keepass2'],
  	    ['key', 'application/x-iwork-keynote-sffkey'],
  	    ['kfo', 'application/vnd.kde.kformula'],
  	    ['kia', 'application/vnd.kidspiration'],
  	    ['kml', 'application/vnd.google-earth.kml+xml'],
  	    ['kmz', 'application/vnd.google-earth.kmz'],
  	    ['kne', 'application/vnd.kinar'],
  	    ['knp', 'application/vnd.kinar'],
  	    ['kon', 'application/vnd.kde.kontour'],
  	    ['kpr', 'application/vnd.kde.kpresenter'],
  	    ['kpt', 'application/vnd.kde.kpresenter'],
  	    ['kpxx', 'application/vnd.ds-keypoint'],
  	    ['ksp', 'application/vnd.kde.kspread'],
  	    ['ktr', 'application/vnd.kahootz'],
  	    ['ktx', 'image/ktx'],
  	    ['ktx2', 'image/ktx2'],
  	    ['ktz', 'application/vnd.kahootz'],
  	    ['kwd', 'application/vnd.kde.kword'],
  	    ['kwt', 'application/vnd.kde.kword'],
  	    ['lasxml', 'application/vnd.las.las+xml'],
  	    ['latex', 'application/x-latex'],
  	    ['lbd', 'application/vnd.llamagraphics.life-balance.desktop'],
  	    ['lbe', 'application/vnd.llamagraphics.life-balance.exchange+xml'],
  	    ['les', 'application/vnd.hhe.lesson-player'],
  	    ['less', 'text/less'],
  	    ['lgr', 'application/lgr+xml'],
  	    ['lha', 'application/octet-stream'],
  	    ['link66', 'application/vnd.route66.link66+xml'],
  	    ['list', 'text/plain'],
  	    ['list3820', 'application/vnd.ibm.modcap'],
  	    ['listafp', 'application/vnd.ibm.modcap'],
  	    ['litcoffee', 'text/coffeescript'],
  	    ['lnk', 'application/x-ms-shortcut'],
  	    ['log', 'text/plain'],
  	    ['lostxml', 'application/lost+xml'],
  	    ['lrf', 'application/octet-stream'],
  	    ['lrm', 'application/vnd.ms-lrm'],
  	    ['ltf', 'application/vnd.frogans.ltf'],
  	    ['lua', 'text/x-lua'],
  	    ['luac', 'application/x-lua-bytecode'],
  	    ['lvp', 'audio/vnd.lucent.voice'],
  	    ['lwp', 'application/vnd.lotus-wordpro'],
  	    ['lzh', 'application/octet-stream'],
  	    ['m1v', 'video/mpeg'],
  	    ['m2a', 'audio/mpeg'],
  	    ['m2v', 'video/mpeg'],
  	    ['m3a', 'audio/mpeg'],
  	    ['m3u', 'text/plain'],
  	    ['m3u8', 'application/vnd.apple.mpegurl'],
  	    ['m4a', 'audio/x-m4a'],
  	    ['m4p', 'application/mp4'],
  	    ['m4s', 'video/iso.segment'],
  	    ['m4u', 'application/vnd.mpegurl'],
  	    ['m4v', 'video/x-m4v'],
  	    ['m13', 'application/x-msmediaview'],
  	    ['m14', 'application/x-msmediaview'],
  	    ['m21', 'application/mp21'],
  	    ['ma', 'application/mathematica'],
  	    ['mads', 'application/mads+xml'],
  	    ['maei', 'application/mmt-aei+xml'],
  	    ['mag', 'application/vnd.ecowin.chart'],
  	    ['maker', 'application/vnd.framemaker'],
  	    ['man', 'text/troff'],
  	    ['manifest', 'text/cache-manifest'],
  	    ['map', 'application/json'],
  	    ['mar', 'application/octet-stream'],
  	    ['markdown', 'text/markdown'],
  	    ['mathml', 'application/mathml+xml'],
  	    ['mb', 'application/mathematica'],
  	    ['mbk', 'application/vnd.mobius.mbk'],
  	    ['mbox', 'application/mbox'],
  	    ['mc1', 'application/vnd.medcalcdata'],
  	    ['mcd', 'application/vnd.mcd'],
  	    ['mcurl', 'text/vnd.curl.mcurl'],
  	    ['md', 'text/markdown'],
  	    ['mdb', 'application/x-msaccess'],
  	    ['mdi', 'image/vnd.ms-modi'],
  	    ['mdx', 'text/mdx'],
  	    ['me', 'text/troff'],
  	    ['mesh', 'model/mesh'],
  	    ['meta4', 'application/metalink4+xml'],
  	    ['metalink', 'application/metalink+xml'],
  	    ['mets', 'application/mets+xml'],
  	    ['mfm', 'application/vnd.mfmp'],
  	    ['mft', 'application/rpki-manifest'],
  	    ['mgp', 'application/vnd.osgeo.mapguide.package'],
  	    ['mgz', 'application/vnd.proteus.magazine'],
  	    ['mid', 'audio/midi'],
  	    ['midi', 'audio/midi'],
  	    ['mie', 'application/x-mie'],
  	    ['mif', 'application/vnd.mif'],
  	    ['mime', 'message/rfc822'],
  	    ['mj2', 'video/mj2'],
  	    ['mjp2', 'video/mj2'],
  	    ['mjs', 'application/javascript'],
  	    ['mk3d', 'video/x-matroska'],
  	    ['mka', 'audio/x-matroska'],
  	    ['mkd', 'text/x-markdown'],
  	    ['mks', 'video/x-matroska'],
  	    ['mkv', 'video/x-matroska'],
  	    ['mlp', 'application/vnd.dolby.mlp'],
  	    ['mmd', 'application/vnd.chipnuts.karaoke-mmd'],
  	    ['mmf', 'application/vnd.smaf'],
  	    ['mml', 'text/mathml'],
  	    ['mmr', 'image/vnd.fujixerox.edmics-mmr'],
  	    ['mng', 'video/x-mng'],
  	    ['mny', 'application/x-msmoney'],
  	    ['mobi', 'application/x-mobipocket-ebook'],
  	    ['mods', 'application/mods+xml'],
  	    ['mov', 'video/quicktime'],
  	    ['movie', 'video/x-sgi-movie'],
  	    ['mp2', 'audio/mpeg'],
  	    ['mp2a', 'audio/mpeg'],
  	    ['mp3', 'audio/mpeg'],
  	    ['mp4', 'video/mp4'],
  	    ['mp4a', 'audio/mp4'],
  	    ['mp4s', 'application/mp4'],
  	    ['mp4v', 'video/mp4'],
  	    ['mp21', 'application/mp21'],
  	    ['mpc', 'application/vnd.mophun.certificate'],
  	    ['mpd', 'application/dash+xml'],
  	    ['mpe', 'video/mpeg'],
  	    ['mpeg', 'video/mpeg'],
  	    ['mpg', 'video/mpeg'],
  	    ['mpg4', 'video/mp4'],
  	    ['mpga', 'audio/mpeg'],
  	    ['mpkg', 'application/vnd.apple.installer+xml'],
  	    ['mpm', 'application/vnd.blueice.multipass'],
  	    ['mpn', 'application/vnd.mophun.application'],
  	    ['mpp', 'application/vnd.ms-project'],
  	    ['mpt', 'application/vnd.ms-project'],
  	    ['mpy', 'application/vnd.ibm.minipay'],
  	    ['mqy', 'application/vnd.mobius.mqy'],
  	    ['mrc', 'application/marc'],
  	    ['mrcx', 'application/marcxml+xml'],
  	    ['ms', 'text/troff'],
  	    ['mscml', 'application/mediaservercontrol+xml'],
  	    ['mseed', 'application/vnd.fdsn.mseed'],
  	    ['mseq', 'application/vnd.mseq'],
  	    ['msf', 'application/vnd.epson.msf'],
  	    ['msg', 'application/vnd.ms-outlook'],
  	    ['msh', 'model/mesh'],
  	    ['msi', 'application/x-msdownload'],
  	    ['msl', 'application/vnd.mobius.msl'],
  	    ['msm', 'application/octet-stream'],
  	    ['msp', 'application/octet-stream'],
  	    ['msty', 'application/vnd.muvee.style'],
  	    ['mtl', 'model/mtl'],
  	    ['mts', 'model/vnd.mts'],
  	    ['mus', 'application/vnd.musician'],
  	    ['musd', 'application/mmt-usd+xml'],
  	    ['musicxml', 'application/vnd.recordare.musicxml+xml'],
  	    ['mvb', 'application/x-msmediaview'],
  	    ['mvt', 'application/vnd.mapbox-vector-tile'],
  	    ['mwf', 'application/vnd.mfer'],
  	    ['mxf', 'application/mxf'],
  	    ['mxl', 'application/vnd.recordare.musicxml'],
  	    ['mxmf', 'audio/mobile-xmf'],
  	    ['mxml', 'application/xv+xml'],
  	    ['mxs', 'application/vnd.triscape.mxs'],
  	    ['mxu', 'video/vnd.mpegurl'],
  	    ['n-gage', 'application/vnd.nokia.n-gage.symbian.install'],
  	    ['n3', 'text/n3'],
  	    ['nb', 'application/mathematica'],
  	    ['nbp', 'application/vnd.wolfram.player'],
  	    ['nc', 'application/x-netcdf'],
  	    ['ncx', 'application/x-dtbncx+xml'],
  	    ['nfo', 'text/x-nfo'],
  	    ['ngdat', 'application/vnd.nokia.n-gage.data'],
  	    ['nitf', 'application/vnd.nitf'],
  	    ['nlu', 'application/vnd.neurolanguage.nlu'],
  	    ['nml', 'application/vnd.enliven'],
  	    ['nnd', 'application/vnd.noblenet-directory'],
  	    ['nns', 'application/vnd.noblenet-sealer'],
  	    ['nnw', 'application/vnd.noblenet-web'],
  	    ['npx', 'image/vnd.net-fpx'],
  	    ['nq', 'application/n-quads'],
  	    ['nsc', 'application/x-conference'],
  	    ['nsf', 'application/vnd.lotus-notes'],
  	    ['nt', 'application/n-triples'],
  	    ['ntf', 'application/vnd.nitf'],
  	    ['numbers', 'application/x-iwork-numbers-sffnumbers'],
  	    ['nzb', 'application/x-nzb'],
  	    ['oa2', 'application/vnd.fujitsu.oasys2'],
  	    ['oa3', 'application/vnd.fujitsu.oasys3'],
  	    ['oas', 'application/vnd.fujitsu.oasys'],
  	    ['obd', 'application/x-msbinder'],
  	    ['obgx', 'application/vnd.openblox.game+xml'],
  	    ['obj', 'model/obj'],
  	    ['oda', 'application/oda'],
  	    ['odb', 'application/vnd.oasis.opendocument.database'],
  	    ['odc', 'application/vnd.oasis.opendocument.chart'],
  	    ['odf', 'application/vnd.oasis.opendocument.formula'],
  	    ['odft', 'application/vnd.oasis.opendocument.formula-template'],
  	    ['odg', 'application/vnd.oasis.opendocument.graphics'],
  	    ['odi', 'application/vnd.oasis.opendocument.image'],
  	    ['odm', 'application/vnd.oasis.opendocument.text-master'],
  	    ['odp', 'application/vnd.oasis.opendocument.presentation'],
  	    ['ods', 'application/vnd.oasis.opendocument.spreadsheet'],
  	    ['odt', 'application/vnd.oasis.opendocument.text'],
  	    ['oga', 'audio/ogg'],
  	    ['ogex', 'model/vnd.opengex'],
  	    ['ogg', 'audio/ogg'],
  	    ['ogv', 'video/ogg'],
  	    ['ogx', 'application/ogg'],
  	    ['omdoc', 'application/omdoc+xml'],
  	    ['onepkg', 'application/onenote'],
  	    ['onetmp', 'application/onenote'],
  	    ['onetoc', 'application/onenote'],
  	    ['onetoc2', 'application/onenote'],
  	    ['opf', 'application/oebps-package+xml'],
  	    ['opml', 'text/x-opml'],
  	    ['oprc', 'application/vnd.palm'],
  	    ['opus', 'audio/ogg'],
  	    ['org', 'text/x-org'],
  	    ['osf', 'application/vnd.yamaha.openscoreformat'],
  	    ['osfpvg', 'application/vnd.yamaha.openscoreformat.osfpvg+xml'],
  	    ['osm', 'application/vnd.openstreetmap.data+xml'],
  	    ['otc', 'application/vnd.oasis.opendocument.chart-template'],
  	    ['otf', 'font/otf'],
  	    ['otg', 'application/vnd.oasis.opendocument.graphics-template'],
  	    ['oth', 'application/vnd.oasis.opendocument.text-web'],
  	    ['oti', 'application/vnd.oasis.opendocument.image-template'],
  	    ['otp', 'application/vnd.oasis.opendocument.presentation-template'],
  	    ['ots', 'application/vnd.oasis.opendocument.spreadsheet-template'],
  	    ['ott', 'application/vnd.oasis.opendocument.text-template'],
  	    ['ova', 'application/x-virtualbox-ova'],
  	    ['ovf', 'application/x-virtualbox-ovf'],
  	    ['owl', 'application/rdf+xml'],
  	    ['oxps', 'application/oxps'],
  	    ['oxt', 'application/vnd.openofficeorg.extension'],
  	    ['p', 'text/x-pascal'],
  	    ['p7a', 'application/x-pkcs7-signature'],
  	    ['p7b', 'application/x-pkcs7-certificates'],
  	    ['p7c', 'application/pkcs7-mime'],
  	    ['p7m', 'application/pkcs7-mime'],
  	    ['p7r', 'application/x-pkcs7-certreqresp'],
  	    ['p7s', 'application/pkcs7-signature'],
  	    ['p8', 'application/pkcs8'],
  	    ['p10', 'application/x-pkcs10'],
  	    ['p12', 'application/x-pkcs12'],
  	    ['pac', 'application/x-ns-proxy-autoconfig'],
  	    ['pages', 'application/x-iwork-pages-sffpages'],
  	    ['pas', 'text/x-pascal'],
  	    ['paw', 'application/vnd.pawaafile'],
  	    ['pbd', 'application/vnd.powerbuilder6'],
  	    ['pbm', 'image/x-portable-bitmap'],
  	    ['pcap', 'application/vnd.tcpdump.pcap'],
  	    ['pcf', 'application/x-font-pcf'],
  	    ['pcl', 'application/vnd.hp-pcl'],
  	    ['pclxl', 'application/vnd.hp-pclxl'],
  	    ['pct', 'image/x-pict'],
  	    ['pcurl', 'application/vnd.curl.pcurl'],
  	    ['pcx', 'image/x-pcx'],
  	    ['pdb', 'application/x-pilot'],
  	    ['pde', 'text/x-processing'],
  	    ['pdf', 'application/pdf'],
  	    ['pem', 'application/x-x509-user-cert'],
  	    ['pfa', 'application/x-font-type1'],
  	    ['pfb', 'application/x-font-type1'],
  	    ['pfm', 'application/x-font-type1'],
  	    ['pfr', 'application/font-tdpfr'],
  	    ['pfx', 'application/x-pkcs12'],
  	    ['pgm', 'image/x-portable-graymap'],
  	    ['pgn', 'application/x-chess-pgn'],
  	    ['pgp', 'application/pgp'],
  	    ['php', 'application/x-httpd-php'],
  	    ['php3', 'application/x-httpd-php'],
  	    ['php4', 'application/x-httpd-php'],
  	    ['phps', 'application/x-httpd-php-source'],
  	    ['phtml', 'application/x-httpd-php'],
  	    ['pic', 'image/x-pict'],
  	    ['pkg', 'application/octet-stream'],
  	    ['pki', 'application/pkixcmp'],
  	    ['pkipath', 'application/pkix-pkipath'],
  	    ['pkpass', 'application/vnd.apple.pkpass'],
  	    ['pl', 'application/x-perl'],
  	    ['plb', 'application/vnd.3gpp.pic-bw-large'],
  	    ['plc', 'application/vnd.mobius.plc'],
  	    ['plf', 'application/vnd.pocketlearn'],
  	    ['pls', 'application/pls+xml'],
  	    ['pm', 'application/x-perl'],
  	    ['pml', 'application/vnd.ctc-posml'],
  	    ['png', 'image/png'],
  	    ['pnm', 'image/x-portable-anymap'],
  	    ['portpkg', 'application/vnd.macports.portpkg'],
  	    ['pot', 'application/vnd.ms-powerpoint'],
  	    ['potm', 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'],
  	    ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
  	    ['ppa', 'application/vnd.ms-powerpoint'],
  	    ['ppam', 'application/vnd.ms-powerpoint.addin.macroEnabled.12'],
  	    ['ppd', 'application/vnd.cups-ppd'],
  	    ['ppm', 'image/x-portable-pixmap'],
  	    ['pps', 'application/vnd.ms-powerpoint'],
  	    ['ppsm', 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'],
  	    ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
  	    ['ppt', 'application/powerpoint'],
  	    ['pptm', 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'],
  	    ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  	    ['pqa', 'application/vnd.palm'],
  	    ['prc', 'application/x-pilot'],
  	    ['pre', 'application/vnd.lotus-freelance'],
  	    ['prf', 'application/pics-rules'],
  	    ['provx', 'application/provenance+xml'],
  	    ['ps', 'application/postscript'],
  	    ['psb', 'application/vnd.3gpp.pic-bw-small'],
  	    ['psd', 'application/x-photoshop'],
  	    ['psf', 'application/x-font-linux-psf'],
  	    ['pskcxml', 'application/pskc+xml'],
  	    ['pti', 'image/prs.pti'],
  	    ['ptid', 'application/vnd.pvi.ptid1'],
  	    ['pub', 'application/x-mspublisher'],
  	    ['pvb', 'application/vnd.3gpp.pic-bw-var'],
  	    ['pwn', 'application/vnd.3m.post-it-notes'],
  	    ['pya', 'audio/vnd.ms-playready.media.pya'],
  	    ['pyv', 'video/vnd.ms-playready.media.pyv'],
  	    ['qam', 'application/vnd.epson.quickanime'],
  	    ['qbo', 'application/vnd.intu.qbo'],
  	    ['qfx', 'application/vnd.intu.qfx'],
  	    ['qps', 'application/vnd.publishare-delta-tree'],
  	    ['qt', 'video/quicktime'],
  	    ['qwd', 'application/vnd.quark.quarkxpress'],
  	    ['qwt', 'application/vnd.quark.quarkxpress'],
  	    ['qxb', 'application/vnd.quark.quarkxpress'],
  	    ['qxd', 'application/vnd.quark.quarkxpress'],
  	    ['qxl', 'application/vnd.quark.quarkxpress'],
  	    ['qxt', 'application/vnd.quark.quarkxpress'],
  	    ['ra', 'audio/x-realaudio'],
  	    ['ram', 'audio/x-pn-realaudio'],
  	    ['raml', 'application/raml+yaml'],
  	    ['rapd', 'application/route-apd+xml'],
  	    ['rar', 'application/x-rar'],
  	    ['ras', 'image/x-cmu-raster'],
  	    ['rcprofile', 'application/vnd.ipunplugged.rcprofile'],
  	    ['rdf', 'application/rdf+xml'],
  	    ['rdz', 'application/vnd.data-vision.rdz'],
  	    ['relo', 'application/p2p-overlay+xml'],
  	    ['rep', 'application/vnd.businessobjects'],
  	    ['res', 'application/x-dtbresource+xml'],
  	    ['rgb', 'image/x-rgb'],
  	    ['rif', 'application/reginfo+xml'],
  	    ['rip', 'audio/vnd.rip'],
  	    ['ris', 'application/x-research-info-systems'],
  	    ['rl', 'application/resource-lists+xml'],
  	    ['rlc', 'image/vnd.fujixerox.edmics-rlc'],
  	    ['rld', 'application/resource-lists-diff+xml'],
  	    ['rm', 'audio/x-pn-realaudio'],
  	    ['rmi', 'audio/midi'],
  	    ['rmp', 'audio/x-pn-realaudio-plugin'],
  	    ['rms', 'application/vnd.jcp.javame.midlet-rms'],
  	    ['rmvb', 'application/vnd.rn-realmedia-vbr'],
  	    ['rnc', 'application/relax-ng-compact-syntax'],
  	    ['rng', 'application/xml'],
  	    ['roa', 'application/rpki-roa'],
  	    ['roff', 'text/troff'],
  	    ['rp9', 'application/vnd.cloanto.rp9'],
  	    ['rpm', 'audio/x-pn-realaudio-plugin'],
  	    ['rpss', 'application/vnd.nokia.radio-presets'],
  	    ['rpst', 'application/vnd.nokia.radio-preset'],
  	    ['rq', 'application/sparql-query'],
  	    ['rs', 'application/rls-services+xml'],
  	    ['rsa', 'application/x-pkcs7'],
  	    ['rsat', 'application/atsc-rsat+xml'],
  	    ['rsd', 'application/rsd+xml'],
  	    ['rsheet', 'application/urc-ressheet+xml'],
  	    ['rss', 'application/rss+xml'],
  	    ['rtf', 'text/rtf'],
  	    ['rtx', 'text/richtext'],
  	    ['run', 'application/x-makeself'],
  	    ['rusd', 'application/route-usd+xml'],
  	    ['rv', 'video/vnd.rn-realvideo'],
  	    ['s', 'text/x-asm'],
  	    ['s3m', 'audio/s3m'],
  	    ['saf', 'application/vnd.yamaha.smaf-audio'],
  	    ['sass', 'text/x-sass'],
  	    ['sbml', 'application/sbml+xml'],
  	    ['sc', 'application/vnd.ibm.secure-container'],
  	    ['scd', 'application/x-msschedule'],
  	    ['scm', 'application/vnd.lotus-screencam'],
  	    ['scq', 'application/scvp-cv-request'],
  	    ['scs', 'application/scvp-cv-response'],
  	    ['scss', 'text/x-scss'],
  	    ['scurl', 'text/vnd.curl.scurl'],
  	    ['sda', 'application/vnd.stardivision.draw'],
  	    ['sdc', 'application/vnd.stardivision.calc'],
  	    ['sdd', 'application/vnd.stardivision.impress'],
  	    ['sdkd', 'application/vnd.solent.sdkm+xml'],
  	    ['sdkm', 'application/vnd.solent.sdkm+xml'],
  	    ['sdp', 'application/sdp'],
  	    ['sdw', 'application/vnd.stardivision.writer'],
  	    ['sea', 'application/octet-stream'],
  	    ['see', 'application/vnd.seemail'],
  	    ['seed', 'application/vnd.fdsn.seed'],
  	    ['sema', 'application/vnd.sema'],
  	    ['semd', 'application/vnd.semd'],
  	    ['semf', 'application/vnd.semf'],
  	    ['senmlx', 'application/senml+xml'],
  	    ['sensmlx', 'application/sensml+xml'],
  	    ['ser', 'application/java-serialized-object'],
  	    ['setpay', 'application/set-payment-initiation'],
  	    ['setreg', 'application/set-registration-initiation'],
  	    ['sfd-hdstx', 'application/vnd.hydrostatix.sof-data'],
  	    ['sfs', 'application/vnd.spotfire.sfs'],
  	    ['sfv', 'text/x-sfv'],
  	    ['sgi', 'image/sgi'],
  	    ['sgl', 'application/vnd.stardivision.writer-global'],
  	    ['sgm', 'text/sgml'],
  	    ['sgml', 'text/sgml'],
  	    ['sh', 'application/x-sh'],
  	    ['shar', 'application/x-shar'],
  	    ['shex', 'text/shex'],
  	    ['shf', 'application/shf+xml'],
  	    ['shtml', 'text/html'],
  	    ['sid', 'image/x-mrsid-image'],
  	    ['sieve', 'application/sieve'],
  	    ['sig', 'application/pgp-signature'],
  	    ['sil', 'audio/silk'],
  	    ['silo', 'model/mesh'],
  	    ['sis', 'application/vnd.symbian.install'],
  	    ['sisx', 'application/vnd.symbian.install'],
  	    ['sit', 'application/x-stuffit'],
  	    ['sitx', 'application/x-stuffitx'],
  	    ['siv', 'application/sieve'],
  	    ['skd', 'application/vnd.koan'],
  	    ['skm', 'application/vnd.koan'],
  	    ['skp', 'application/vnd.koan'],
  	    ['skt', 'application/vnd.koan'],
  	    ['sldm', 'application/vnd.ms-powerpoint.slide.macroenabled.12'],
  	    ['sldx', 'application/vnd.openxmlformats-officedocument.presentationml.slide'],
  	    ['slim', 'text/slim'],
  	    ['slm', 'text/slim'],
  	    ['sls', 'application/route-s-tsid+xml'],
  	    ['slt', 'application/vnd.epson.salt'],
  	    ['sm', 'application/vnd.stepmania.stepchart'],
  	    ['smf', 'application/vnd.stardivision.math'],
  	    ['smi', 'application/smil'],
  	    ['smil', 'application/smil'],
  	    ['smv', 'video/x-smv'],
  	    ['smzip', 'application/vnd.stepmania.package'],
  	    ['snd', 'audio/basic'],
  	    ['snf', 'application/x-font-snf'],
  	    ['so', 'application/octet-stream'],
  	    ['spc', 'application/x-pkcs7-certificates'],
  	    ['spdx', 'text/spdx'],
  	    ['spf', 'application/vnd.yamaha.smaf-phrase'],
  	    ['spl', 'application/x-futuresplash'],
  	    ['spot', 'text/vnd.in3d.spot'],
  	    ['spp', 'application/scvp-vp-response'],
  	    ['spq', 'application/scvp-vp-request'],
  	    ['spx', 'audio/ogg'],
  	    ['sql', 'application/x-sql'],
  	    ['src', 'application/x-wais-source'],
  	    ['srt', 'application/x-subrip'],
  	    ['sru', 'application/sru+xml'],
  	    ['srx', 'application/sparql-results+xml'],
  	    ['ssdl', 'application/ssdl+xml'],
  	    ['sse', 'application/vnd.kodak-descriptor'],
  	    ['ssf', 'application/vnd.epson.ssf'],
  	    ['ssml', 'application/ssml+xml'],
  	    ['sst', 'application/octet-stream'],
  	    ['st', 'application/vnd.sailingtracker.track'],
  	    ['stc', 'application/vnd.sun.xml.calc.template'],
  	    ['std', 'application/vnd.sun.xml.draw.template'],
  	    ['stf', 'application/vnd.wt.stf'],
  	    ['sti', 'application/vnd.sun.xml.impress.template'],
  	    ['stk', 'application/hyperstudio'],
  	    ['stl', 'model/stl'],
  	    ['stpx', 'model/step+xml'],
  	    ['stpxz', 'model/step-xml+zip'],
  	    ['stpz', 'model/step+zip'],
  	    ['str', 'application/vnd.pg.format'],
  	    ['stw', 'application/vnd.sun.xml.writer.template'],
  	    ['styl', 'text/stylus'],
  	    ['stylus', 'text/stylus'],
  	    ['sub', 'text/vnd.dvb.subtitle'],
  	    ['sus', 'application/vnd.sus-calendar'],
  	    ['susp', 'application/vnd.sus-calendar'],
  	    ['sv4cpio', 'application/x-sv4cpio'],
  	    ['sv4crc', 'application/x-sv4crc'],
  	    ['svc', 'application/vnd.dvb.service'],
  	    ['svd', 'application/vnd.svd'],
  	    ['svg', 'image/svg+xml'],
  	    ['svgz', 'image/svg+xml'],
  	    ['swa', 'application/x-director'],
  	    ['swf', 'application/x-shockwave-flash'],
  	    ['swi', 'application/vnd.aristanetworks.swi'],
  	    ['swidtag', 'application/swid+xml'],
  	    ['sxc', 'application/vnd.sun.xml.calc'],
  	    ['sxd', 'application/vnd.sun.xml.draw'],
  	    ['sxg', 'application/vnd.sun.xml.writer.global'],
  	    ['sxi', 'application/vnd.sun.xml.impress'],
  	    ['sxm', 'application/vnd.sun.xml.math'],
  	    ['sxw', 'application/vnd.sun.xml.writer'],
  	    ['t', 'text/troff'],
  	    ['t3', 'application/x-t3vm-image'],
  	    ['t38', 'image/t38'],
  	    ['taglet', 'application/vnd.mynfc'],
  	    ['tao', 'application/vnd.tao.intent-module-archive'],
  	    ['tap', 'image/vnd.tencent.tap'],
  	    ['tar', 'application/x-tar'],
  	    ['tcap', 'application/vnd.3gpp2.tcap'],
  	    ['tcl', 'application/x-tcl'],
  	    ['td', 'application/urc-targetdesc+xml'],
  	    ['teacher', 'application/vnd.smart.teacher'],
  	    ['tei', 'application/tei+xml'],
  	    ['teicorpus', 'application/tei+xml'],
  	    ['tex', 'application/x-tex'],
  	    ['texi', 'application/x-texinfo'],
  	    ['texinfo', 'application/x-texinfo'],
  	    ['text', 'text/plain'],
  	    ['tfi', 'application/thraud+xml'],
  	    ['tfm', 'application/x-tex-tfm'],
  	    ['tfx', 'image/tiff-fx'],
  	    ['tga', 'image/x-tga'],
  	    ['tgz', 'application/x-tar'],
  	    ['thmx', 'application/vnd.ms-officetheme'],
  	    ['tif', 'image/tiff'],
  	    ['tiff', 'image/tiff'],
  	    ['tk', 'application/x-tcl'],
  	    ['tmo', 'application/vnd.tmobile-livetv'],
  	    ['toml', 'application/toml'],
  	    ['torrent', 'application/x-bittorrent'],
  	    ['tpl', 'application/vnd.groove-tool-template'],
  	    ['tpt', 'application/vnd.trid.tpt'],
  	    ['tr', 'text/troff'],
  	    ['tra', 'application/vnd.trueapp'],
  	    ['trig', 'application/trig'],
  	    ['trm', 'application/x-msterminal'],
  	    ['ts', 'video/mp2t'],
  	    ['tsd', 'application/timestamped-data'],
  	    ['tsv', 'text/tab-separated-values'],
  	    ['ttc', 'font/collection'],
  	    ['ttf', 'font/ttf'],
  	    ['ttl', 'text/turtle'],
  	    ['ttml', 'application/ttml+xml'],
  	    ['twd', 'application/vnd.simtech-mindmapper'],
  	    ['twds', 'application/vnd.simtech-mindmapper'],
  	    ['txd', 'application/vnd.genomatix.tuxedo'],
  	    ['txf', 'application/vnd.mobius.txf'],
  	    ['txt', 'text/plain'],
  	    ['u8dsn', 'message/global-delivery-status'],
  	    ['u8hdr', 'message/global-headers'],
  	    ['u8mdn', 'message/global-disposition-notification'],
  	    ['u8msg', 'message/global'],
  	    ['u32', 'application/x-authorware-bin'],
  	    ['ubj', 'application/ubjson'],
  	    ['udeb', 'application/x-debian-package'],
  	    ['ufd', 'application/vnd.ufdl'],
  	    ['ufdl', 'application/vnd.ufdl'],
  	    ['ulx', 'application/x-glulx'],
  	    ['umj', 'application/vnd.umajin'],
  	    ['unityweb', 'application/vnd.unity'],
  	    ['uoml', 'application/vnd.uoml+xml'],
  	    ['uri', 'text/uri-list'],
  	    ['uris', 'text/uri-list'],
  	    ['urls', 'text/uri-list'],
  	    ['usdz', 'model/vnd.usdz+zip'],
  	    ['ustar', 'application/x-ustar'],
  	    ['utz', 'application/vnd.uiq.theme'],
  	    ['uu', 'text/x-uuencode'],
  	    ['uva', 'audio/vnd.dece.audio'],
  	    ['uvd', 'application/vnd.dece.data'],
  	    ['uvf', 'application/vnd.dece.data'],
  	    ['uvg', 'image/vnd.dece.graphic'],
  	    ['uvh', 'video/vnd.dece.hd'],
  	    ['uvi', 'image/vnd.dece.graphic'],
  	    ['uvm', 'video/vnd.dece.mobile'],
  	    ['uvp', 'video/vnd.dece.pd'],
  	    ['uvs', 'video/vnd.dece.sd'],
  	    ['uvt', 'application/vnd.dece.ttml+xml'],
  	    ['uvu', 'video/vnd.uvvu.mp4'],
  	    ['uvv', 'video/vnd.dece.video'],
  	    ['uvva', 'audio/vnd.dece.audio'],
  	    ['uvvd', 'application/vnd.dece.data'],
  	    ['uvvf', 'application/vnd.dece.data'],
  	    ['uvvg', 'image/vnd.dece.graphic'],
  	    ['uvvh', 'video/vnd.dece.hd'],
  	    ['uvvi', 'image/vnd.dece.graphic'],
  	    ['uvvm', 'video/vnd.dece.mobile'],
  	    ['uvvp', 'video/vnd.dece.pd'],
  	    ['uvvs', 'video/vnd.dece.sd'],
  	    ['uvvt', 'application/vnd.dece.ttml+xml'],
  	    ['uvvu', 'video/vnd.uvvu.mp4'],
  	    ['uvvv', 'video/vnd.dece.video'],
  	    ['uvvx', 'application/vnd.dece.unspecified'],
  	    ['uvvz', 'application/vnd.dece.zip'],
  	    ['uvx', 'application/vnd.dece.unspecified'],
  	    ['uvz', 'application/vnd.dece.zip'],
  	    ['vbox', 'application/x-virtualbox-vbox'],
  	    ['vbox-extpack', 'application/x-virtualbox-vbox-extpack'],
  	    ['vcard', 'text/vcard'],
  	    ['vcd', 'application/x-cdlink'],
  	    ['vcf', 'text/x-vcard'],
  	    ['vcg', 'application/vnd.groove-vcard'],
  	    ['vcs', 'text/x-vcalendar'],
  	    ['vcx', 'application/vnd.vcx'],
  	    ['vdi', 'application/x-virtualbox-vdi'],
  	    ['vds', 'model/vnd.sap.vds'],
  	    ['vhd', 'application/x-virtualbox-vhd'],
  	    ['vis', 'application/vnd.visionary'],
  	    ['viv', 'video/vnd.vivo'],
  	    ['vlc', 'application/videolan'],
  	    ['vmdk', 'application/x-virtualbox-vmdk'],
  	    ['vob', 'video/x-ms-vob'],
  	    ['vor', 'application/vnd.stardivision.writer'],
  	    ['vox', 'application/x-authorware-bin'],
  	    ['vrml', 'model/vrml'],
  	    ['vsd', 'application/vnd.visio'],
  	    ['vsf', 'application/vnd.vsf'],
  	    ['vss', 'application/vnd.visio'],
  	    ['vst', 'application/vnd.visio'],
  	    ['vsw', 'application/vnd.visio'],
  	    ['vtf', 'image/vnd.valve.source.texture'],
  	    ['vtt', 'text/vtt'],
  	    ['vtu', 'model/vnd.vtu'],
  	    ['vxml', 'application/voicexml+xml'],
  	    ['w3d', 'application/x-director'],
  	    ['wad', 'application/x-doom'],
  	    ['wadl', 'application/vnd.sun.wadl+xml'],
  	    ['war', 'application/java-archive'],
  	    ['wasm', 'application/wasm'],
  	    ['wav', 'audio/x-wav'],
  	    ['wax', 'audio/x-ms-wax'],
  	    ['wbmp', 'image/vnd.wap.wbmp'],
  	    ['wbs', 'application/vnd.criticaltools.wbs+xml'],
  	    ['wbxml', 'application/wbxml'],
  	    ['wcm', 'application/vnd.ms-works'],
  	    ['wdb', 'application/vnd.ms-works'],
  	    ['wdp', 'image/vnd.ms-photo'],
  	    ['weba', 'audio/webm'],
  	    ['webapp', 'application/x-web-app-manifest+json'],
  	    ['webm', 'video/webm'],
  	    ['webmanifest', 'application/manifest+json'],
  	    ['webp', 'image/webp'],
  	    ['wg', 'application/vnd.pmi.widget'],
  	    ['wgt', 'application/widget'],
  	    ['wks', 'application/vnd.ms-works'],
  	    ['wm', 'video/x-ms-wm'],
  	    ['wma', 'audio/x-ms-wma'],
  	    ['wmd', 'application/x-ms-wmd'],
  	    ['wmf', 'image/wmf'],
  	    ['wml', 'text/vnd.wap.wml'],
  	    ['wmlc', 'application/wmlc'],
  	    ['wmls', 'text/vnd.wap.wmlscript'],
  	    ['wmlsc', 'application/vnd.wap.wmlscriptc'],
  	    ['wmv', 'video/x-ms-wmv'],
  	    ['wmx', 'video/x-ms-wmx'],
  	    ['wmz', 'application/x-msmetafile'],
  	    ['woff', 'font/woff'],
  	    ['woff2', 'font/woff2'],
  	    ['word', 'application/msword'],
  	    ['wpd', 'application/vnd.wordperfect'],
  	    ['wpl', 'application/vnd.ms-wpl'],
  	    ['wps', 'application/vnd.ms-works'],
  	    ['wqd', 'application/vnd.wqd'],
  	    ['wri', 'application/x-mswrite'],
  	    ['wrl', 'model/vrml'],
  	    ['wsc', 'message/vnd.wfa.wsc'],
  	    ['wsdl', 'application/wsdl+xml'],
  	    ['wspolicy', 'application/wspolicy+xml'],
  	    ['wtb', 'application/vnd.webturbo'],
  	    ['wvx', 'video/x-ms-wvx'],
  	    ['x3d', 'model/x3d+xml'],
  	    ['x3db', 'model/x3d+fastinfoset'],
  	    ['x3dbz', 'model/x3d+binary'],
  	    ['x3dv', 'model/x3d-vrml'],
  	    ['x3dvz', 'model/x3d+vrml'],
  	    ['x3dz', 'model/x3d+xml'],
  	    ['x32', 'application/x-authorware-bin'],
  	    ['x_b', 'model/vnd.parasolid.transmit.binary'],
  	    ['x_t', 'model/vnd.parasolid.transmit.text'],
  	    ['xaml', 'application/xaml+xml'],
  	    ['xap', 'application/x-silverlight-app'],
  	    ['xar', 'application/vnd.xara'],
  	    ['xav', 'application/xcap-att+xml'],
  	    ['xbap', 'application/x-ms-xbap'],
  	    ['xbd', 'application/vnd.fujixerox.docuworks.binder'],
  	    ['xbm', 'image/x-xbitmap'],
  	    ['xca', 'application/xcap-caps+xml'],
  	    ['xcs', 'application/calendar+xml'],
  	    ['xdf', 'application/xcap-diff+xml'],
  	    ['xdm', 'application/vnd.syncml.dm+xml'],
  	    ['xdp', 'application/vnd.adobe.xdp+xml'],
  	    ['xdssc', 'application/dssc+xml'],
  	    ['xdw', 'application/vnd.fujixerox.docuworks'],
  	    ['xel', 'application/xcap-el+xml'],
  	    ['xenc', 'application/xenc+xml'],
  	    ['xer', 'application/patch-ops-error+xml'],
  	    ['xfdf', 'application/vnd.adobe.xfdf'],
  	    ['xfdl', 'application/vnd.xfdl'],
  	    ['xht', 'application/xhtml+xml'],
  	    ['xhtml', 'application/xhtml+xml'],
  	    ['xhvml', 'application/xv+xml'],
  	    ['xif', 'image/vnd.xiff'],
  	    ['xl', 'application/excel'],
  	    ['xla', 'application/vnd.ms-excel'],
  	    ['xlam', 'application/vnd.ms-excel.addin.macroEnabled.12'],
  	    ['xlc', 'application/vnd.ms-excel'],
  	    ['xlf', 'application/xliff+xml'],
  	    ['xlm', 'application/vnd.ms-excel'],
  	    ['xls', 'application/vnd.ms-excel'],
  	    ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
  	    ['xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.12'],
  	    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  	    ['xlt', 'application/vnd.ms-excel'],
  	    ['xltm', 'application/vnd.ms-excel.template.macroEnabled.12'],
  	    ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
  	    ['xlw', 'application/vnd.ms-excel'],
  	    ['xm', 'audio/xm'],
  	    ['xml', 'application/xml'],
  	    ['xns', 'application/xcap-ns+xml'],
  	    ['xo', 'application/vnd.olpc-sugar'],
  	    ['xop', 'application/xop+xml'],
  	    ['xpi', 'application/x-xpinstall'],
  	    ['xpl', 'application/xproc+xml'],
  	    ['xpm', 'image/x-xpixmap'],
  	    ['xpr', 'application/vnd.is-xpr'],
  	    ['xps', 'application/vnd.ms-xpsdocument'],
  	    ['xpw', 'application/vnd.intercon.formnet'],
  	    ['xpx', 'application/vnd.intercon.formnet'],
  	    ['xsd', 'application/xml'],
  	    ['xsl', 'application/xml'],
  	    ['xslt', 'application/xslt+xml'],
  	    ['xsm', 'application/vnd.syncml+xml'],
  	    ['xspf', 'application/xspf+xml'],
  	    ['xul', 'application/vnd.mozilla.xul+xml'],
  	    ['xvm', 'application/xv+xml'],
  	    ['xvml', 'application/xv+xml'],
  	    ['xwd', 'image/x-xwindowdump'],
  	    ['xyz', 'chemical/x-xyz'],
  	    ['xz', 'application/x-xz'],
  	    ['yaml', 'text/yaml'],
  	    ['yang', 'application/yang'],
  	    ['yin', 'application/yin+xml'],
  	    ['yml', 'text/yaml'],
  	    ['ymp', 'text/x-suse-ymp'],
  	    ['z', 'application/x-compress'],
  	    ['z1', 'application/x-zmachine'],
  	    ['z2', 'application/x-zmachine'],
  	    ['z3', 'application/x-zmachine'],
  	    ['z4', 'application/x-zmachine'],
  	    ['z5', 'application/x-zmachine'],
  	    ['z6', 'application/x-zmachine'],
  	    ['z7', 'application/x-zmachine'],
  	    ['z8', 'application/x-zmachine'],
  	    ['zaz', 'application/vnd.zzazz.deck+xml'],
  	    ['zip', 'application/zip'],
  	    ['zir', 'application/vnd.zul'],
  	    ['zirz', 'application/vnd.zul'],
  	    ['zmm', 'application/vnd.handheld-entertainment+xml'],
  	    ['zsh', 'text/x-scriptzsh']
  	]);
  	function toFileWithPath(file, path, h) {
  	    var f = withMimeType(file);
  	    var webkitRelativePath = file.webkitRelativePath;
  	    var p = typeof path === 'string'
  	        ? path
  	        // If <input webkitdirectory> is set,
  	        // the File will have a {webkitRelativePath} property
  	        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
  	        : typeof webkitRelativePath === 'string' && webkitRelativePath.length > 0
  	            ? webkitRelativePath
  	            : "./".concat(file.name);
  	    if (typeof f.path !== 'string') { // on electron, path is already set to the absolute path
  	        setObjProp(f, 'path', p);
  	    }
  	    if (h !== undefined) {
  	        Object.defineProperty(f, 'handle', {
  	            value: h,
  	            writable: false,
  	            configurable: false,
  	            enumerable: true
  	        });
  	    }
  	    // Always populate a relative path so that even electron apps have access to a relativePath value
  	    setObjProp(f, 'relativePath', p);
  	    return f;
  	}
  	function withMimeType(file) {
  	    var name = file.name;
  	    var hasExtension = name && name.lastIndexOf('.') !== -1;
  	    if (hasExtension && !file.type) {
  	        var ext = name.split('.')
  	            .pop().toLowerCase();
  	        var type = exports$1.COMMON_MIME_TYPES.get(ext);
  	        if (type) {
  	            Object.defineProperty(file, 'type', {
  	                value: type,
  	                writable: false,
  	                configurable: false,
  	                enumerable: true
  	            });
  	        }
  	    }
  	    return file;
  	}
  	function setObjProp(f, key, value) {
  	    Object.defineProperty(f, key, {
  	        value: value,
  	        writable: false,
  	        configurable: false,
  	        enumerable: true
  	    });
  	}
  	
  } (file));

  var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (g && (g = 0, op[0] && (_ = 0)), _) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  };
  var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  };
  Object.defineProperty(fileSelector, "__esModule", { value: true });
  fileSelector.fromEvent = fromEvent;
  var file_1 = file;
  var FILES_TO_IGNORE = [
      // Thumbnail cache files for macOS and Windows
      '.DS_Store', // macOs
      'Thumbs.db' // Windows
  ];
  /**
   * Convert a DragEvent's DataTrasfer object to a list of File objects
   * NOTE: If some of the items are folders,
   * everything will be flattened and placed in the same list but the paths will be kept as a {path} property.
   *
   * EXPERIMENTAL: A list of https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle objects can also be passed as an arg
   * and a list of File objects will be returned.
   *
   * @param evt
   */
  function fromEvent(evt) {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              if (isObject(evt) && isDataTransfer(evt.dataTransfer)) {
                  return [2 /*return*/, getDataTransferFiles(evt.dataTransfer, evt.type)];
              }
              else if (isChangeEvt(evt)) {
                  return [2 /*return*/, getInputFiles(evt)];
              }
              else if (Array.isArray(evt) && evt.every(function (item) { return 'getFile' in item && typeof item.getFile === 'function'; })) {
                  return [2 /*return*/, getFsHandleFiles(evt)];
              }
              return [2 /*return*/, []];
          });
      });
  }
  function isDataTransfer(value) {
      return isObject(value);
  }
  function isChangeEvt(value) {
      return isObject(value) && isObject(value.target);
  }
  function isObject(v) {
      return typeof v === 'object' && v !== null;
  }
  function getInputFiles(evt) {
      return fromList(evt.target.files).map(function (file) { return (0, file_1.toFileWithPath)(file); });
  }
  // Ee expect each handle to be https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
  function getFsHandleFiles(handles) {
      return __awaiter(this, void 0, void 0, function () {
          var files;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0: return [4 /*yield*/, Promise.all(handles.map(function (h) { return h.getFile(); }))];
                  case 1:
                      files = _a.sent();
                      return [2 /*return*/, files.map(function (file) { return (0, file_1.toFileWithPath)(file); })];
              }
          });
      });
  }
  function getDataTransferFiles(dt, type) {
      return __awaiter(this, void 0, void 0, function () {
          var items, files;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0:
                      if (!dt.items) return [3 /*break*/, 2];
                      items = fromList(dt.items)
                          .filter(function (item) { return item.kind === 'file'; });
                      // According to https://html.spec.whatwg.org/multipage/dnd.html#dndevents,
                      // only 'dragstart' and 'drop' has access to the data (source node)
                      if (type !== 'drop') {
                          return [2 /*return*/, items];
                      }
                      return [4 /*yield*/, Promise.all(items.map(toFilePromises))];
                  case 1:
                      files = _a.sent();
                      return [2 /*return*/, noIgnoredFiles(flatten(files))];
                  case 2: return [2 /*return*/, noIgnoredFiles(fromList(dt.files)
                          .map(function (file) { return (0, file_1.toFileWithPath)(file); }))];
              }
          });
      });
  }
  function noIgnoredFiles(files) {
      return files.filter(function (file) { return FILES_TO_IGNORE.indexOf(file.name) === -1; });
  }
  // IE11 does not support Array.from()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility
  // https://developer.mozilla.org/en-US/docs/Web/API/FileList
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
  function fromList(items) {
      if (items === null) {
          return [];
      }
      var files = [];
      // tslint:disable: prefer-for-of
      for (var i = 0; i < items.length; i++) {
          var file = items[i];
          files.push(file);
      }
      return files;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
  function toFilePromises(item) {
      if (typeof item.webkitGetAsEntry !== 'function') {
          return fromDataTransferItem(item);
      }
      var entry = item.webkitGetAsEntry();
      // Safari supports dropping an image node from a different window and can be retrieved using
      // the DataTransferItem.getAsFile() API
      // NOTE: FileSystemEntry.file() throws if trying to get the file
      if (entry && entry.isDirectory) {
          return fromDirEntry(entry);
      }
      return fromDataTransferItem(item, entry);
  }
  function flatten(items) {
      return items.reduce(function (acc, files) { return __spreadArray(__spreadArray([], __read(acc), false), __read((Array.isArray(files) ? flatten(files) : [files])), false); }, []);
  }
  function fromDataTransferItem(item, entry) {
      return __awaiter(this, void 0, void 0, function () {
          var h, file_2, file, fwp;
          var _a;
          return __generator(this, function (_b) {
              switch (_b.label) {
                  case 0:
                      if (!(globalThis.isSecureContext && typeof item.getAsFileSystemHandle === 'function')) return [3 /*break*/, 3];
                      return [4 /*yield*/, item.getAsFileSystemHandle()];
                  case 1:
                      h = _b.sent();
                      if (h === null) {
                          throw new Error("".concat(item, " is not a File"));
                      }
                      if (!(h !== undefined)) return [3 /*break*/, 3];
                      return [4 /*yield*/, h.getFile()];
                  case 2:
                      file_2 = _b.sent();
                      file_2.handle = h;
                      return [2 /*return*/, (0, file_1.toFileWithPath)(file_2)];
                  case 3:
                      file = item.getAsFile();
                      if (!file) {
                          throw new Error("".concat(item, " is not a File"));
                      }
                      fwp = (0, file_1.toFileWithPath)(file, (_a = entry === null || entry === void 0 ? void 0 : entry.fullPath) !== null && _a !== void 0 ? _a : undefined);
                      return [2 /*return*/, fwp];
              }
          });
      });
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
  function fromEntry(entry) {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              return [2 /*return*/, entry.isDirectory ? fromDirEntry(entry) : fromFileEntry(entry)];
          });
      });
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
  function fromDirEntry(entry) {
      var reader = entry.createReader();
      return new Promise(function (resolve, reject) {
          var entries = [];
          function readEntries() {
              var _this = this;
              // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry/createReader
              // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
              reader.readEntries(function (batch) { return __awaiter(_this, void 0, void 0, function () {
                  var files, err_1, items;
                  return __generator(this, function (_a) {
                      switch (_a.label) {
                          case 0:
                              if (!!batch.length) return [3 /*break*/, 5];
                              _a.label = 1;
                          case 1:
                              _a.trys.push([1, 3, , 4]);
                              return [4 /*yield*/, Promise.all(entries)];
                          case 2:
                              files = _a.sent();
                              resolve(files);
                              return [3 /*break*/, 4];
                          case 3:
                              err_1 = _a.sent();
                              reject(err_1);
                              return [3 /*break*/, 4];
                          case 4: return [3 /*break*/, 6];
                          case 5:
                              items = Promise.all(batch.map(fromEntry));
                              entries.push(items);
                              // Continue reading
                              readEntries();
                              _a.label = 6;
                          case 6: return [2 /*return*/];
                      }
                  });
              }); }, function (err) {
                  reject(err);
              });
          }
          readEntries();
      });
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
  function fromFileEntry(entry) {
      return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
              return [2 /*return*/, new Promise(function (resolve, reject) {
                      entry.file(function (file) {
                          var fwp = (0, file_1.toFileWithPath)(file, entry.fullPath);
                          resolve(fwp);
                      }, function (err) {
                          reject(err);
                      });
                  })];
          });
      });
  }

  (function (exports$1) {
  	Object.defineProperty(exports$1, "__esModule", { value: true });
  	exports$1.fromEvent = void 0;
  	var file_selector_1 = fileSelector;
  	Object.defineProperty(exports$1, "fromEvent", { enumerable: true, get: function () { return file_selector_1.fromEvent; } });
  	
  } (dist$1));

  var dist=function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:false,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=true,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:true,get:n});},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:true});},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:true,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){r.__esModule=true,r.default=function(e,r){if(e&&r){var t=Array.isArray(r)?r:r.split(",");if(0===t.length)return  true;var n=e.name||"",o=(e.type||"").toLowerCase(),u=o.replace(/\/.*$/,"");return t.some((function(e){var r=e.trim().toLowerCase();return "."===r.charAt(0)?n.toLowerCase().endsWith(r):r.endsWith("/*")?u===r.replace(/\/.*$/,""):o===r}))}return  true};}]);

  var _accepts = /*@__PURE__*/getDefaultExportFromCjs(dist);

  function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1(); }

  function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray$1(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$1(arr); }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1(); }

  function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$1(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
  var accepts = typeof _accepts === "function" ? _accepts : _accepts.default; // Error codes

  var FILE_INVALID_TYPE = "file-invalid-type";
  var FILE_TOO_LARGE = "file-too-large";
  var FILE_TOO_SMALL = "file-too-small";
  var TOO_MANY_FILES = "too-many-files";
  /**
   *
   * @param {string} accept
   */

  var getInvalidTypeRejectionErr = function getInvalidTypeRejectionErr() {
    var accept = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var acceptArr = accept.split(",");
    var msg = acceptArr.length > 1 ? "one of ".concat(acceptArr.join(", ")) : acceptArr[0];
    return {
      code: FILE_INVALID_TYPE,
      message: "File type must be ".concat(msg)
    };
  };
  var getTooLargeRejectionErr = function getTooLargeRejectionErr(maxSize) {
    return {
      code: FILE_TOO_LARGE,
      message: "File is larger than ".concat(maxSize, " ").concat(maxSize === 1 ? "byte" : "bytes")
    };
  };
  var getTooSmallRejectionErr = function getTooSmallRejectionErr(minSize) {
    return {
      code: FILE_TOO_SMALL,
      message: "File is smaller than ".concat(minSize, " ").concat(minSize === 1 ? "byte" : "bytes")
    };
  };
  var TOO_MANY_FILES_REJECTION = {
    code: TOO_MANY_FILES,
    message: "Too many files"
  };
  /**
   * Check if the given file is a DataTransferItem with an empty type.
   *
   * During drag events, browsers may return DataTransferItem objects instead of File objects.
   * Some browsers (e.g., Chrome) return an empty MIME type for certain file types (like .md files)
   * on DataTransferItem during drag events, even though the type is correctly set during drop.
   *
   * This function detects such cases by checking for:
   * 1. Empty type string
   * 2. Presence of getAsFile method (indicates it's a DataTransferItem, not a File)
   *
   * We accept these during drag to provide proper UI feedback, while maintaining
   * strict validation during drop when real File objects are available.
   *
   * @param {File | DataTransferItem} file
   * @returns {boolean}
   */

  function isDataTransferItemWithEmptyType(file) {
    return file.type === "" && typeof file.getAsFile === "function";
  }
  /**
   * Check if file is accepted.
   *
   * Firefox versions prior to 53 return a bogus MIME type for every file drag,
   * so dragovers with that MIME type will always be accepted.
   *
   * Chrome/other browsers may return an empty MIME type for files during drag events,
   * so we accept those as well (we'll validate properly on drop).
   *
   * @param {File} file
   * @param {string} accept
   * @returns
   */

  function fileAccepted(file, accept) {
    var isAcceptable = file.type === "application/x-moz-file" || accepts(file, accept) || isDataTransferItemWithEmptyType(file);
    return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(accept)];
  }
  function fileMatchSize(file, minSize, maxSize) {
    if (isDefined(file.size)) {
      if (isDefined(minSize) && isDefined(maxSize)) {
        if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
        if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
      } else if (isDefined(minSize) && file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];else if (isDefined(maxSize) && file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
    }

    return [true, null];
  }

  function isDefined(value) {
    return value !== undefined && value !== null;
  }
  /**
   *
   * @param {object} options
   * @param {File[]} options.files
   * @param {string} [options.accept]
   * @param {number} [options.minSize]
   * @param {number} [options.maxSize]
   * @param {boolean} [options.multiple]
   * @param {number} [options.maxFiles]
   * @param {(f: File) => FileError|FileError[]|null} [options.validator]
   * @returns
   */


  function allFilesAccepted(_ref) {
    var files = _ref.files,
        accept = _ref.accept,
        minSize = _ref.minSize,
        maxSize = _ref.maxSize,
        multiple = _ref.multiple,
        maxFiles = _ref.maxFiles,
        validator = _ref.validator;

    if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) {
      return false;
    }

    return files.every(function (file) {
      var _fileAccepted = fileAccepted(file, accept),
          _fileAccepted2 = _slicedToArray$1(_fileAccepted, 1),
          accepted = _fileAccepted2[0];

      var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
          _fileMatchSize2 = _slicedToArray$1(_fileMatchSize, 1),
          sizeMatch = _fileMatchSize2[0];

      var customErrors = validator ? validator(file) : null;
      return accepted && sizeMatch && !customErrors;
    });
  } // React's synthetic events has event.isPropagationStopped,
  // but to remain compatibility with other libs (Preact) fall back
  // to check event.cancelBubble

  function isPropagationStopped(event) {
    if (typeof event.isPropagationStopped === "function") {
      return event.isPropagationStopped();
    } else if (typeof event.cancelBubble !== "undefined") {
      return event.cancelBubble;
    }

    return false;
  }
  function isEvtWithFiles(event) {
    if (!event.dataTransfer) {
      return !!event.target && !!event.target.files;
    } // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file


    return Array.prototype.some.call(event.dataTransfer.types, function (type) {
      return type === "Files" || type === "application/x-moz-file";
    });
  }

  function onDocumentDragOver(event) {
    event.preventDefault();
  }

  function isIe(userAgent) {
    return userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1;
  }

  function isEdge(userAgent) {
    return userAgent.indexOf("Edge/") !== -1;
  }

  function isIeOrEdge() {
    var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;
    return isIe(userAgent) || isEdge(userAgent);
  }
  /**
   * This is intended to be used to compose event handlers
   * They are executed in order until one of them calls `event.isPropagationStopped()`.
   * Note that the check is done on the first invoke too,
   * meaning that if propagation was stopped before invoking the fns,
   * no handlers will be executed.
   *
   * @param {Function} fns the event hanlder functions
   * @return {Function} the event handler to add to an element
   */

  function composeEventHandlers() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    return function (event) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return fns.some(function (fn) {
        if (!isPropagationStopped(event) && fn) {
          fn.apply(void 0, [event].concat(args));
        }

        return isPropagationStopped(event);
      });
    };
  }
  /**
   * canUseFileSystemAccessAPI checks if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
   * is supported by the browser.
   * @returns {boolean}
   */

  function canUseFileSystemAccessAPI() {
    return "showOpenFilePicker" in window;
  }
  /**
   * Convert the `{accept}` dropzone prop to the
   * `{types}` option for https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
   *
   * @param {AcceptProp} accept
   * @returns {{accept: string[]}[]}
   */

  function pickerOptionsFromAccept(accept) {
    if (isDefined(accept)) {
      var acceptForPicker = Object.entries(accept).filter(function (_ref2) {
        var _ref3 = _slicedToArray$1(_ref2, 2),
            mimeType = _ref3[0],
            ext = _ref3[1];

        var ok = true;

        if (!isMIMEType(mimeType)) {
          console.warn("Skipped \"".concat(mimeType, "\" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types."));
          ok = false;
        }

        if (!Array.isArray(ext) || !ext.every(isExt)) {
          console.warn("Skipped \"".concat(mimeType, "\" because an invalid file extension was provided."));
          ok = false;
        }

        return ok;
      }).reduce(function (agg, _ref4) {
        var _ref5 = _slicedToArray$1(_ref4, 2),
            mimeType = _ref5[0],
            ext = _ref5[1];

        return _objectSpread$1(_objectSpread$1({}, agg), {}, _defineProperty$1({}, mimeType, ext));
      }, {});
      return [{
        // description is required due to https://crbug.com/1264708
        description: "Files",
        accept: acceptForPicker
      }];
    }

    return accept;
  }
  /**
   * Convert the `{accept}` dropzone prop to an array of MIME types/extensions.
   * @param {AcceptProp} accept
   * @returns {string}
   */

  function acceptPropAsAcceptAttr(accept) {
    if (isDefined(accept)) {
      return Object.entries(accept).reduce(function (a, _ref6) {
        var _ref7 = _slicedToArray$1(_ref6, 2),
            mimeType = _ref7[0],
            ext = _ref7[1];

        return [].concat(_toConsumableArray$1(a), [mimeType], _toConsumableArray$1(ext));
      }, []) // Silently discard invalid entries as pickerOptionsFromAccept warns about these
      .filter(function (v) {
        return isMIMEType(v) || isExt(v);
      }).join(",");
    }

    return undefined;
  }
  /**
   * Check if v is an exception caused by aborting a request (e.g window.showOpenFilePicker()).
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
   * @param {any} v
   * @returns {boolean} True if v is an abort exception.
   */

  function isAbort(v) {
    return v instanceof DOMException && (v.name === "AbortError" || v.code === v.ABORT_ERR);
  }
  /**
   * Check if v is a security error.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
   * @param {any} v
   * @returns {boolean} True if v is a security error.
   */

  function isSecurityError(v) {
    return v instanceof DOMException && (v.name === "SecurityError" || v.code === v.SECURITY_ERR);
  }
  /**
   * Check if v is a MIME type string.
   *
   * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
   *
   * @param {string} v
   */

  function isMIMEType(v) {
    return v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || v === "application/*" || /\w+\/[-+.\w]+/g.test(v);
  }
  /**
   * Check if v is a file extension.
   * @param {string} v
   */

  function isExt(v) {
    return /^.*\.[\w]+$/.test(v);
  }
  /**
   * @typedef {Object.<string, string[]>} AcceptProp
   */

  /**
   * @typedef {object} FileError
   * @property {string} message
   * @property {ErrorCode|string} code
   */

  /**
   * @typedef {"file-invalid-type"|"file-too-large"|"file-too-small"|"too-many-files"} ErrorCode
   */

  var _excluded = ["children"],
      _excluded2 = ["open"],
      _excluded3 = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"],
      _excluded4 = ["refKey", "onChange", "onClick"];

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
  /**
   * Convenience wrapper component for the `useDropzone` hook
   *
   * ```jsx
   * <Dropzone>
   *   {({getRootProps, getInputProps}) => (
   *     <div {...getRootProps()}>
   *       <input {...getInputProps()} />
   *       <p>Drag 'n' drop some files here, or click to select files</p>
   *     </div>
   *   )}
   * </Dropzone>
   * ```
   */

  var Dropzone = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
    var children = _ref.children,
        params = _objectWithoutProperties(_ref, _excluded);

    var _useDropzone = useDropzone(params),
        open = _useDropzone.open,
        props = _objectWithoutProperties(_useDropzone, _excluded2);

    React.useImperativeHandle(ref, function () {
      return {
        open: open
      };
    }, [open]); // TODO: Figure out why react-styleguidist cannot create docs if we don't return a jsx element

    return /*#__PURE__*/React__default.default.createElement(React.Fragment, null, children(_objectSpread(_objectSpread({}, props), {}, {
      open: open
    })));
  });
  Dropzone.displayName = "Dropzone"; // Add default props for react-docgen

  var defaultProps = {
    disabled: false,
    getFilesFromEvent: dist$1.fromEvent,
    maxSize: Infinity,
    minSize: 0,
    multiple: true,
    maxFiles: 0,
    preventDropOnDocument: true,
    noClick: false,
    noKeyboard: false,
    noDrag: false,
    noDragEventsBubbling: false,
    validator: null,
    useFsAccessApi: false,
    autoFocus: false
  };
  Dropzone.defaultProps = defaultProps;
  Dropzone.propTypes = {
    /**
     * Render function that exposes the dropzone state and prop getter fns
     *
     * @param {object} params
     * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
     * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
     * @param {Function} params.open Open the native file selection dialog
     * @param {boolean} params.isFocused Dropzone area is in focus
     * @param {boolean} params.isFileDialogActive File dialog is opened
     * @param {boolean} params.isDragActive Active drag is in progress
     * @param {boolean} params.isDragAccept Dragged files are accepted
     * @param {boolean} params.isDragReject True only during an active drag when some dragged files would be rejected. After drop, this resets to false. Use fileRejections for post-drop errors.
     * @param {boolean} params.isDragGlobal Files are being dragged anywhere on the document
     * @param {File[]} params.acceptedFiles Accepted files
     * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected. This persists after drop and is the source of truth for post-drop rejections.
     */
    children: PropTypes__default.default.func,

    /**
     * Set accepted file types.
     * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
     * Keep in mind that mime type determination is not reliable across platforms. CSV files,
     * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
     * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
     */
    accept: PropTypes__default.default.objectOf(PropTypes__default.default.arrayOf(PropTypes__default.default.string)),

    /**
     * Allow drag 'n' drop (or selection from the file dialog) of multiple files
     */
    multiple: PropTypes__default.default.bool,

    /**
     * If false, allow dropped items to take over the current browser window
     */
    preventDropOnDocument: PropTypes__default.default.bool,

    /**
     * If true, disables click to open the native file selection dialog
     */
    noClick: PropTypes__default.default.bool,

    /**
     * If true, disables SPACE/ENTER to open the native file selection dialog.
     * Note that it also stops tracking the focus state.
     */
    noKeyboard: PropTypes__default.default.bool,

    /**
     * If true, disables drag 'n' drop
     */
    noDrag: PropTypes__default.default.bool,

    /**
     * If true, stops drag event propagation to parents
     */
    noDragEventsBubbling: PropTypes__default.default.bool,

    /**
     * Minimum file size (in bytes)
     */
    minSize: PropTypes__default.default.number,

    /**
     * Maximum file size (in bytes)
     */
    maxSize: PropTypes__default.default.number,

    /**
     * Maximum accepted number of files
     * The default value is 0 which means there is no limitation to how many files are accepted.
     */
    maxFiles: PropTypes__default.default.number,

    /**
     * Enable/disable the dropzone
     */
    disabled: PropTypes__default.default.bool,

    /**
     * Use this to provide a custom file aggregator
     *
     * @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
     */
    getFilesFromEvent: PropTypes__default.default.func,

    /**
     * Cb for when closing the file dialog with no selection
     */
    onFileDialogCancel: PropTypes__default.default.func,

    /**
     * Cb for when opening the file dialog
     */
    onFileDialogOpen: PropTypes__default.default.func,

    /**
     * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
     * to open the file picker instead of using an `<input type="file">` click event.
     */
    useFsAccessApi: PropTypes__default.default.bool,

    /**
     * Set to true to focus the root element on render
     */
    autoFocus: PropTypes__default.default.bool,

    /**
     * Cb for when the `dragenter` event occurs.
     *
     * @param {DragEvent} event
     */
    onDragEnter: PropTypes__default.default.func,

    /**
     * Cb for when the `dragleave` event occurs
     *
     * @param {DragEvent} event
     */
    onDragLeave: PropTypes__default.default.func,

    /**
     * Cb for when the `dragover` event occurs
     *
     * @param {DragEvent} event
     */
    onDragOver: PropTypes__default.default.func,

    /**
     * Cb for when the `drop` event occurs.
     * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
     *
     * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
     * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
     * If `multiple` is set to false and additional files are dropped,
     * all files besides the first will be rejected.
     * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
     *
     * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
     * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
     *
     * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
     * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
     *
     * ```js
     * function onDrop(acceptedFiles) {
     *   const req = request.post('/upload')
     *   acceptedFiles.forEach(file => {
     *     req.attach(file.name, file)
     *   })
     *   req.end(callback)
     * }
     * ```
     *
     * @param {File[]} acceptedFiles
     * @param {FileRejection[]} fileRejections
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     */
    onDrop: PropTypes__default.default.func,

    /**
     * Cb for when the `drop` event occurs.
     * Note that if no files are accepted, this callback is not invoked.
     *
     * @param {File[]} files
     * @param {(DragEvent|Event)} event
     */
    onDropAccepted: PropTypes__default.default.func,

    /**
     * Cb for when the `drop` event occurs.
     * Note that if no files are rejected, this callback is not invoked.
     *
     * @param {FileRejection[]} fileRejections
     * @param {(DragEvent|Event)} event
     */
    onDropRejected: PropTypes__default.default.func,

    /**
     * Cb for when there's some error from any of the promises.
     *
     * @param {Error} error
     */
    onError: PropTypes__default.default.func,

    /**
     * Custom validation function. It must return null if there's no errors.
     * @param {File} file
     * @returns {FileError|FileError[]|null}
     */
    validator: PropTypes__default.default.func
  };
  /**
   * A function that is invoked for the `dragenter`,
   * `dragover` and `dragleave` events.
   * It is not invoked if the items are not files (such as link, text, etc.).
   *
   * @callback dragCb
   * @param {DragEvent} event
   */

  /**
   * A function that is invoked for the `drop` or input change event.
   * It is not invoked if the items are not files (such as link, text, etc.).
   *
   * @callback dropCb
   * @param {File[]} acceptedFiles List of accepted files
   * @param {FileRejection[]} fileRejections List of rejected files and why they were rejected. This is the authoritative source for post-drop file rejections.
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */

  /**
   * A function that is invoked for the `drop` or input change event.
   * It is not invoked if the items are files (such as link, text, etc.).
   *
   * @callback dropAcceptedCb
   * @param {File[]} files List of accepted files that meet the given criteria
   * (`accept`, `multiple`, `minSize`, `maxSize`)
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */

  /**
   * A function that is invoked for the `drop` or input change event.
   *
   * @callback dropRejectedCb
   * @param {File[]} files List of rejected files that do not meet the given criteria
   * (`accept`, `multiple`, `minSize`, `maxSize`)
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */

  /**
   * A function that is used aggregate files,
   * in a asynchronous fashion, from drag or input change events.
   *
   * @callback getFilesFromEvent
   * @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
   * @returns {(File[]|Promise<File[]>)}
   */

  /**
   * An object with the current dropzone state.
   *
   * @typedef {object} DropzoneState
   * @property {boolean} isFocused Dropzone area is in focus
   * @property {boolean} isFileDialogActive File dialog is opened
   * @property {boolean} isDragActive Active drag is in progress
   * @property {boolean} isDragAccept Dragged files are accepted
   * @property {boolean} isDragReject True only during an active drag when some dragged files would be rejected. After drop, this resets to false. Use fileRejections for post-drop errors.
   * @property {boolean} isDragGlobal Files are being dragged anywhere on the document
   * @property {File[]} acceptedFiles Accepted files
   * @property {FileRejection[]} fileRejections Rejected files and why they were rejected. This persists after drop and is the source of truth for post-drop rejections.
   */

  /**
   * An object with the dropzone methods.
   *
   * @typedef {object} DropzoneMethods
   * @property {Function} getRootProps Returns the props you should apply to the root drop container you render
   * @property {Function} getInputProps Returns the props you should apply to hidden file input you render
   * @property {Function} open Open the native file selection dialog
   */

  var initialState = {
    isFocused: false,
    isFileDialogActive: false,
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
    isDragGlobal: false,
    acceptedFiles: [],
    fileRejections: []
  };
  /**
   * A React hook that creates a drag 'n' drop area.
   *
   * ```jsx
   * function MyDropzone(props) {
   *   const {getRootProps, getInputProps} = useDropzone({
   *     onDrop: acceptedFiles => {
   *       // do something with the File objects, e.g. upload to some server
   *     }
   *   });
   *   return (
   *     <div {...getRootProps()}>
   *       <input {...getInputProps()} />
   *       <p>Drag and drop some files here, or click to select files</p>
   *     </div>
   *   )
   * }
   * ```
   *
   * @function useDropzone
   *
   * @param {object} props
   * @param {import("./utils").AcceptProp} [props.accept] Set accepted file types.
   * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
   * @param {boolean} [props.multiple=true] Allow drag 'n' drop (or selection from the file dialog) of multiple files
   * @param {boolean} [props.preventDropOnDocument=true] If false, allow dropped items to take over the current browser window
   * @param {boolean} [props.noClick=false] If true, disables click to open the native file selection dialog
   * @param {boolean} [props.noKeyboard=false] If true, disables SPACE/ENTER to open the native file selection dialog.
   * Note that it also stops tracking the focus state.
   * @param {boolean} [props.noDrag=false] If true, disables drag 'n' drop
   * @param {boolean} [props.noDragEventsBubbling=false] If true, stops drag event propagation to parents
   * @param {number} [props.minSize=0] Minimum file size (in bytes)
   * @param {number} [props.maxSize=Infinity] Maximum file size (in bytes)
   * @param {boolean} [props.disabled=false] Enable/disable the dropzone
   * @param {getFilesFromEvent} [props.getFilesFromEvent] Use this to provide a custom file aggregator
   * @param {Function} [props.onFileDialogCancel] Cb for when closing the file dialog with no selection
   * @param {boolean} [props.useFsAccessApi] Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
   * to open the file picker instead of using an `<input type="file">` click event.
   * @param {boolean} autoFocus Set to true to auto focus the root element.
   * @param {Function} [props.onFileDialogOpen] Cb for when opening the file dialog
   * @param {dragCb} [props.onDragEnter] Cb for when the `dragenter` event occurs.
   * @param {dragCb} [props.onDragLeave] Cb for when the `dragleave` event occurs
   * @param {dragCb} [props.onDragOver] Cb for when the `dragover` event occurs
   * @param {dropCb} [props.onDrop] Cb for when the `drop` event occurs.
   * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
   *
   * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
   * `accept` must be an object with keys as a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) and the value an array of file extensions (optional).
   * If `multiple` is set to false and additional files are dropped,
   * all files besides the first will be rejected.
   * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
   *
   * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
   * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
   *
   * The second parameter (fileRejections) is the authoritative list of rejected files after a drop.
   * Use this parameter or the fileRejections state property to handle post-drop file rejections,
   * as isDragReject only indicates rejection state during active drag operations.
   *
   * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
   * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
   *
   * ```js
   * function onDrop(acceptedFiles) {
   *   const req = request.post('/upload')
   *   acceptedFiles.forEach(file => {
   *     req.attach(file.name, file)
   *   })
   *   req.end(callback)
   * }
   * ```
   * @param {dropAcceptedCb} [props.onDropAccepted]
   * @param {dropRejectedCb} [props.onDropRejected]
   * @param {(error: Error) => void} [props.onError]
   *
   * @returns {DropzoneState & DropzoneMethods}
   */

  function useDropzone() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _defaultProps$props = _objectSpread(_objectSpread({}, defaultProps), props),
        accept = _defaultProps$props.accept,
        disabled = _defaultProps$props.disabled,
        getFilesFromEvent = _defaultProps$props.getFilesFromEvent,
        maxSize = _defaultProps$props.maxSize,
        minSize = _defaultProps$props.minSize,
        multiple = _defaultProps$props.multiple,
        maxFiles = _defaultProps$props.maxFiles,
        onDragEnter = _defaultProps$props.onDragEnter,
        onDragLeave = _defaultProps$props.onDragLeave,
        onDragOver = _defaultProps$props.onDragOver,
        onDrop = _defaultProps$props.onDrop,
        onDropAccepted = _defaultProps$props.onDropAccepted,
        onDropRejected = _defaultProps$props.onDropRejected,
        onFileDialogCancel = _defaultProps$props.onFileDialogCancel,
        onFileDialogOpen = _defaultProps$props.onFileDialogOpen,
        useFsAccessApi = _defaultProps$props.useFsAccessApi,
        autoFocus = _defaultProps$props.autoFocus,
        preventDropOnDocument = _defaultProps$props.preventDropOnDocument,
        noClick = _defaultProps$props.noClick,
        noKeyboard = _defaultProps$props.noKeyboard,
        noDrag = _defaultProps$props.noDrag,
        noDragEventsBubbling = _defaultProps$props.noDragEventsBubbling,
        onError = _defaultProps$props.onError,
        validator = _defaultProps$props.validator;

    var acceptAttr = React.useMemo(function () {
      return acceptPropAsAcceptAttr(accept);
    }, [accept]);
    var pickerTypes = React.useMemo(function () {
      return pickerOptionsFromAccept(accept);
    }, [accept]);
    var onFileDialogOpenCb = React.useMemo(function () {
      return typeof onFileDialogOpen === "function" ? onFileDialogOpen : noop;
    }, [onFileDialogOpen]);
    var onFileDialogCancelCb = React.useMemo(function () {
      return typeof onFileDialogCancel === "function" ? onFileDialogCancel : noop;
    }, [onFileDialogCancel]);
    /**
     * @constant
     * @type {React.MutableRefObject<HTMLElement>}
     */

    var rootRef = React.useRef(null);
    var inputRef = React.useRef(null);

    var _useReducer = React.useReducer(reducer, initialState),
        _useReducer2 = _slicedToArray(_useReducer, 2),
        state = _useReducer2[0],
        dispatch = _useReducer2[1];

    var isFocused = state.isFocused,
        isFileDialogActive = state.isFileDialogActive;
    var fsAccessApiWorksRef = React.useRef(typeof window !== "undefined" && window.isSecureContext && useFsAccessApi && canUseFileSystemAccessAPI()); // Update file dialog active state when the window is focused on

    var onWindowFocus = function onWindowFocus() {
      // Execute the timeout only if the file dialog is opened in the browser
      if (!fsAccessApiWorksRef.current && isFileDialogActive) {
        setTimeout(function () {
          if (inputRef.current) {
            var files = inputRef.current.files;

            if (!files.length) {
              dispatch({
                type: "closeDialog"
              });
              onFileDialogCancelCb();
            }
          }
        }, 300);
      }
    };

    React.useEffect(function () {
      window.addEventListener("focus", onWindowFocus, false);
      return function () {
        window.removeEventListener("focus", onWindowFocus, false);
      };
    }, [inputRef, isFileDialogActive, onFileDialogCancelCb, fsAccessApiWorksRef]);
    var dragTargetsRef = React.useRef([]);
    var globalDragTargetsRef = React.useRef([]);

    var onDocumentDrop = function onDocumentDrop(event) {
      if (rootRef.current && rootRef.current.contains(event.target)) {
        // If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
        return;
      }

      event.preventDefault();
      dragTargetsRef.current = [];
    };

    React.useEffect(function () {
      if (preventDropOnDocument) {
        document.addEventListener("dragover", onDocumentDragOver, false);
        document.addEventListener("drop", onDocumentDrop, false);
      }

      return function () {
        if (preventDropOnDocument) {
          document.removeEventListener("dragover", onDocumentDragOver);
          document.removeEventListener("drop", onDocumentDrop);
        }
      };
    }, [rootRef, preventDropOnDocument]); // Track global drag state for document-level drag events

    React.useEffect(function () {
      var onDocumentDragEnter = function onDocumentDragEnter(event) {
        globalDragTargetsRef.current = [].concat(_toConsumableArray(globalDragTargetsRef.current), [event.target]);

        if (isEvtWithFiles(event)) {
          dispatch({
            isDragGlobal: true,
            type: "setDragGlobal"
          });
        }
      };

      var onDocumentDragLeave = function onDocumentDragLeave(event) {
        // Only deactivate once we've left all children
        globalDragTargetsRef.current = globalDragTargetsRef.current.filter(function (el) {
          return el !== event.target && el !== null;
        });

        if (globalDragTargetsRef.current.length > 0) {
          return;
        }

        dispatch({
          isDragGlobal: false,
          type: "setDragGlobal"
        });
      };

      var onDocumentDragEnd = function onDocumentDragEnd() {
        globalDragTargetsRef.current = [];
        dispatch({
          isDragGlobal: false,
          type: "setDragGlobal"
        });
      };

      var onDocumentDropGlobal = function onDocumentDropGlobal() {
        globalDragTargetsRef.current = [];
        dispatch({
          isDragGlobal: false,
          type: "setDragGlobal"
        });
      };

      document.addEventListener("dragenter", onDocumentDragEnter, false);
      document.addEventListener("dragleave", onDocumentDragLeave, false);
      document.addEventListener("dragend", onDocumentDragEnd, false);
      document.addEventListener("drop", onDocumentDropGlobal, false);
      return function () {
        document.removeEventListener("dragenter", onDocumentDragEnter);
        document.removeEventListener("dragleave", onDocumentDragLeave);
        document.removeEventListener("dragend", onDocumentDragEnd);
        document.removeEventListener("drop", onDocumentDropGlobal);
      };
    }, [rootRef]); // Auto focus the root when autoFocus is true

    React.useEffect(function () {
      if (!disabled && autoFocus && rootRef.current) {
        rootRef.current.focus();
      }

      return function () {};
    }, [rootRef, autoFocus, disabled]);
    var onErrCb = React.useCallback(function (e) {
      if (onError) {
        onError(e);
      } else {
        // Let the user know something's gone wrong if they haven't provided the onError cb.
        console.error(e);
      }
    }, [onError]);
    var onDragEnterCb = React.useCallback(function (event) {
      event.preventDefault(); // Persist here because we need the event later after getFilesFromEvent() is done

      event.persist();
      stopPropagation(event);
      dragTargetsRef.current = [].concat(_toConsumableArray(dragTargetsRef.current), [event.target]);

      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event)).then(function (files) {
          if (isPropagationStopped(event) && !noDragEventsBubbling) {
            return;
          }

          var fileCount = files.length;
          var isDragAccept = fileCount > 0 && allFilesAccepted({
            files: files,
            accept: acceptAttr,
            minSize: minSize,
            maxSize: maxSize,
            multiple: multiple,
            maxFiles: maxFiles,
            validator: validator
          });
          var isDragReject = fileCount > 0 && !isDragAccept;
          dispatch({
            isDragAccept: isDragAccept,
            isDragReject: isDragReject,
            isDragActive: true,
            type: "setDraggedFiles"
          });

          if (onDragEnter) {
            onDragEnter(event);
          }
        }).catch(function (e) {
          return onErrCb(e);
        });
      }
    }, [getFilesFromEvent, onDragEnter, onErrCb, noDragEventsBubbling, acceptAttr, minSize, maxSize, multiple, maxFiles, validator]);
    var onDragOverCb = React.useCallback(function (event) {
      event.preventDefault();
      event.persist();
      stopPropagation(event);
      var hasFiles = isEvtWithFiles(event);

      if (hasFiles && event.dataTransfer) {
        try {
          event.dataTransfer.dropEffect = "copy";
        } catch (_unused) {}
        /* eslint-disable-line no-empty */

      }

      if (hasFiles && onDragOver) {
        onDragOver(event);
      }

      return false;
    }, [onDragOver, noDragEventsBubbling]);
    var onDragLeaveCb = React.useCallback(function (event) {
      event.preventDefault();
      event.persist();
      stopPropagation(event); // Only deactivate once the dropzone and all children have been left

      var targets = dragTargetsRef.current.filter(function (target) {
        return rootRef.current && rootRef.current.contains(target);
      }); // Make sure to remove a target present multiple times only once
      // (Firefox may fire dragenter/dragleave multiple times on the same element)

      var targetIdx = targets.indexOf(event.target);

      if (targetIdx !== -1) {
        targets.splice(targetIdx, 1);
      }

      dragTargetsRef.current = targets;

      if (targets.length > 0) {
        return;
      }

      dispatch({
        type: "setDraggedFiles",
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false
      });

      if (isEvtWithFiles(event) && onDragLeave) {
        onDragLeave(event);
      }
    }, [rootRef, onDragLeave, noDragEventsBubbling]);
    var setFiles = React.useCallback(function (files, event) {
      var acceptedFiles = [];
      var fileRejections = [];
      files.forEach(function (file) {
        var _fileAccepted = fileAccepted(file, acceptAttr),
            _fileAccepted2 = _slicedToArray(_fileAccepted, 2),
            accepted = _fileAccepted2[0],
            acceptError = _fileAccepted2[1];

        var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
            _fileMatchSize2 = _slicedToArray(_fileMatchSize, 2),
            sizeMatch = _fileMatchSize2[0],
            sizeError = _fileMatchSize2[1];

        var customErrors = validator ? validator(file) : null;

        if (accepted && sizeMatch && !customErrors) {
          acceptedFiles.push(file);
        } else {
          var errors = [acceptError, sizeError];

          if (customErrors) {
            errors = errors.concat(customErrors);
          }

          fileRejections.push({
            file: file,
            errors: errors.filter(function (e) {
              return e;
            })
          });
        }
      });

      if (!multiple && acceptedFiles.length > 1 || multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles) {
        // Reject everything and empty accepted files
        acceptedFiles.forEach(function (file) {
          fileRejections.push({
            file: file,
            errors: [TOO_MANY_FILES_REJECTION]
          });
        });
        acceptedFiles.splice(0);
      }

      dispatch({
        acceptedFiles: acceptedFiles,
        fileRejections: fileRejections,
        type: "setFiles"
      });

      if (onDrop) {
        onDrop(acceptedFiles, fileRejections, event);
      }

      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections, event);
      }

      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles, event);
      }
    }, [dispatch, multiple, acceptAttr, minSize, maxSize, maxFiles, onDrop, onDropAccepted, onDropRejected, validator]);
    var onDropCb = React.useCallback(function (event) {
      event.preventDefault(); // Persist here because we need the event later after getFilesFromEvent() is done

      event.persist();
      stopPropagation(event);
      dragTargetsRef.current = [];

      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event)).then(function (files) {
          if (isPropagationStopped(event) && !noDragEventsBubbling) {
            return;
          }

          setFiles(files, event);
        }).catch(function (e) {
          return onErrCb(e);
        });
      }

      dispatch({
        type: "reset"
      });
    }, [getFilesFromEvent, setFiles, onErrCb, noDragEventsBubbling]); // Fn for opening the file dialog programmatically

    var openFileDialog = React.useCallback(function () {
      // No point to use FS access APIs if context is not secure
      // https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#feature_detection
      if (fsAccessApiWorksRef.current) {
        dispatch({
          type: "openDialog"
        });
        onFileDialogOpenCb(); // https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker

        var opts = {
          multiple: multiple,
          types: pickerTypes
        };
        window.showOpenFilePicker(opts).then(function (handles) {
          return getFilesFromEvent(handles);
        }).then(function (files) {
          setFiles(files, null);
          dispatch({
            type: "closeDialog"
          });
        }).catch(function (e) {
          // AbortError means the user canceled
          if (isAbort(e)) {
            onFileDialogCancelCb(e);
            dispatch({
              type: "closeDialog"
            });
          } else if (isSecurityError(e)) {
            fsAccessApiWorksRef.current = false; // CORS, so cannot use this API
            // Try using the input

            if (inputRef.current) {
              inputRef.current.value = null;
              inputRef.current.click();
            } else {
              onErrCb(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."));
            }
          } else {
            onErrCb(e);
          }
        });
        return;
      }

      if (inputRef.current) {
        dispatch({
          type: "openDialog"
        });
        onFileDialogOpenCb();
        inputRef.current.value = null;
        inputRef.current.click();
      }
    }, [dispatch, onFileDialogOpenCb, onFileDialogCancelCb, useFsAccessApi, setFiles, onErrCb, pickerTypes, multiple]); // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone

    var onKeyDownCb = React.useCallback(function (event) {
      // Ignore keyboard events bubbling up the DOM tree
      if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) {
        return;
      }

      if (event.key === " " || event.key === "Enter" || event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        openFileDialog();
      }
    }, [rootRef, openFileDialog]); // Update focus state for the dropzone

    var onFocusCb = React.useCallback(function () {
      dispatch({
        type: "focus"
      });
    }, []);
    var onBlurCb = React.useCallback(function () {
      dispatch({
        type: "blur"
      });
    }, []); // Cb to open the file dialog when click occurs on the dropzone

    var onClickCb = React.useCallback(function () {
      if (noClick) {
        return;
      } // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
      // to ensure React can handle state changes
      // See: https://github.com/react-dropzone/react-dropzone/issues/450


      if (isIeOrEdge()) {
        setTimeout(openFileDialog, 0);
      } else {
        openFileDialog();
      }
    }, [noClick, openFileDialog]);

    var composeHandler = function composeHandler(fn) {
      return disabled ? null : fn;
    };

    var composeKeyboardHandler = function composeKeyboardHandler(fn) {
      return noKeyboard ? null : composeHandler(fn);
    };

    var composeDragHandler = function composeDragHandler(fn) {
      return noDrag ? null : composeHandler(fn);
    };

    var stopPropagation = function stopPropagation(event) {
      if (noDragEventsBubbling) {
        event.stopPropagation();
      }
    };

    var getRootProps = React.useMemo(function () {
      return function () {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$refKey = _ref2.refKey,
            refKey = _ref2$refKey === void 0 ? "ref" : _ref2$refKey,
            role = _ref2.role,
            onKeyDown = _ref2.onKeyDown,
            onFocus = _ref2.onFocus,
            onBlur = _ref2.onBlur,
            onClick = _ref2.onClick,
            onDragEnter = _ref2.onDragEnter,
            onDragOver = _ref2.onDragOver,
            onDragLeave = _ref2.onDragLeave,
            onDrop = _ref2.onDrop,
            rest = _objectWithoutProperties(_ref2, _excluded3);

        return _objectSpread(_objectSpread(_defineProperty({
          onKeyDown: composeKeyboardHandler(composeEventHandlers(onKeyDown, onKeyDownCb)),
          onFocus: composeKeyboardHandler(composeEventHandlers(onFocus, onFocusCb)),
          onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
          onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
          onDragEnter: composeDragHandler(composeEventHandlers(onDragEnter, onDragEnterCb)),
          onDragOver: composeDragHandler(composeEventHandlers(onDragOver, onDragOverCb)),
          onDragLeave: composeDragHandler(composeEventHandlers(onDragLeave, onDragLeaveCb)),
          onDrop: composeDragHandler(composeEventHandlers(onDrop, onDropCb)),
          role: typeof role === "string" && role !== "" ? role : "presentation"
        }, refKey, rootRef), !disabled && !noKeyboard ? {
          tabIndex: 0
        } : {}), rest);
      };
    }, [rootRef, onKeyDownCb, onFocusCb, onBlurCb, onClickCb, onDragEnterCb, onDragOverCb, onDragLeaveCb, onDropCb, noKeyboard, noDrag, disabled]);
    var onInputElementClick = React.useCallback(function (event) {
      event.stopPropagation();
    }, []);
    var getInputProps = React.useMemo(function () {
      return function () {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref3$refKey = _ref3.refKey,
            refKey = _ref3$refKey === void 0 ? "ref" : _ref3$refKey,
            onChange = _ref3.onChange,
            onClick = _ref3.onClick,
            rest = _objectWithoutProperties(_ref3, _excluded4);

        var inputProps = _defineProperty({
          accept: acceptAttr,
          multiple: multiple,
          type: "file",
          style: {
            border: 0,
            clip: "rect(0, 0, 0, 0)",
            clipPath: "inset(50%)",
            height: "1px",
            margin: "0 -1px -1px 0",
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            width: "1px",
            whiteSpace: "nowrap"
          },
          onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
          onClick: composeHandler(composeEventHandlers(onClick, onInputElementClick)),
          tabIndex: -1
        }, refKey, inputRef);

        return _objectSpread(_objectSpread({}, inputProps), rest);
      };
    }, [inputRef, accept, multiple, onDropCb, disabled]);
    return _objectSpread(_objectSpread({}, state), {}, {
      isFocused: isFocused && !disabled,
      getRootProps: getRootProps,
      getInputProps: getInputProps,
      rootRef: rootRef,
      inputRef: inputRef,
      open: composeHandler(openFileDialog)
    });
  }
  /**
   * @param {DropzoneState} state
   * @param {{type: string} & DropzoneState} action
   * @returns {DropzoneState}
   */

  function reducer(state, action) {
    /* istanbul ignore next */
    switch (action.type) {
      case "focus":
        return _objectSpread(_objectSpread({}, state), {}, {
          isFocused: true
        });

      case "blur":
        return _objectSpread(_objectSpread({}, state), {}, {
          isFocused: false
        });

      case "openDialog":
        return _objectSpread(_objectSpread({}, initialState), {}, {
          isFileDialogActive: true
        });

      case "closeDialog":
        return _objectSpread(_objectSpread({}, state), {}, {
          isFileDialogActive: false
        });

      case "setDraggedFiles":
        return _objectSpread(_objectSpread({}, state), {}, {
          isDragActive: action.isDragActive,
          isDragAccept: action.isDragAccept,
          isDragReject: action.isDragReject
        });

      case "setFiles":
        return _objectSpread(_objectSpread({}, state), {}, {
          acceptedFiles: action.acceptedFiles,
          fileRejections: action.fileRejections,
          isDragReject: false
        });

      case "setDragGlobal":
        return _objectSpread(_objectSpread({}, state), {}, {
          isDragGlobal: action.isDragGlobal
        });

      case "reset":
        return _objectSpread({}, initialState);

      default:
        return state;
    }
  }

  function noop() {}

  const ImageUploadDropzone = ({
    multiple,
    disabled,
    onDropAccepted
  }) => {
    const {
      getRootProps,
      getInputProps,
      isDragActive
    } = useDropzone({
      accept: IMAGE_ACCEPT_MAP,
      multiple,
      disabled,
      onDropAccepted: acceptedFiles => void onDropAccepted(acceptedFiles),
      noClick: false,
      noKeyboard: false
    });
    const hint = isDragActive ? 'Drop the images here...' : 'Drag & drop images here, or click to select';
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, _extends({}, getRootProps(), {
      padding: "default",
      border: "default",
      borderRadius: "default",
      backgroundColor: isDragActive ? 'grey20' : 'white',
      style: {
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderStyle: 'dashed',
        marginBottom: 8
      }
    }), /*#__PURE__*/React__default.default.createElement("input", getInputProps()), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      color: "grey60"
    }, hint));
  };

  const ImageUploadPreviewStrip = ({
    previewUrls
  }) => {
    if (previewUrls.length === 0) return null;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "default",
      display: "flex",
      flexWrap: "wrap",
      gap: "default"
    }, previewUrls.map(url => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: url,
      position: "relative",
      mb: "sm",
      display: "flex",
      alignItems: "center",
      gap: "default"
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: url,
      alt: "",
      style: UPLOADING_PREVIEW_STYLE
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.7)"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null)))));
  };

  const CARD_STYLE = {
    width: THUMB_SIZE,
    overflow: 'hidden',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5'
  };
  const IMG_CONTAINER_STYLE = {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    display: 'block'
  };
  const IMG_STYLE = {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    objectFit: 'cover',
    display: 'block'
  };
  function ThumbnailOverlay({
    status
  }) {
    if (status === 'loaded') return null;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "default",
      backgroundColor: "grey20"
    }, status === 'loading' && /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null), status === 'error' && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      color: "error"
    }, "Failed to load"));
  }
  const ImageUploadThumbnail = ({
    url,
    variant,
    index,
    onRemove
  }) => {
    const [status, setStatus] = React.useState('loading');
    const img = /*#__PURE__*/React__default.default.createElement("img", {
      src: url,
      alt: "",
      style: IMG_STYLE,
      onLoad: () => setStatus('loaded'),
      onError: () => setStatus('error')
    });
    const imageLink = /*#__PURE__*/React__default.default.createElement("a", {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: 'block',
        lineHeight: 0
      }
    }, img);
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: CARD_STYLE
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      position: "relative",
      style: IMG_CONTAINER_STYLE
    }, imageLink, /*#__PURE__*/React__default.default.createElement(ThumbnailOverlay, {
      status: status
    })), variant === 'edit' && onRemove && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      padding: "sm"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      size: "sm",
      variant: "danger",
      onClick: () => onRemove(index),
      style: {
        width: '100%'
      }
    }, "Remove")));
  };

  const ImageUploadFieldEdit = ({
    field,
    status,
    actions
  }) => {
    const previewUrls = useObjectUrls(field.uploadingFiles);
    const label = field.isMultiple ? LABELS.photos : LABELS.mainPhoto;
    const dropzoneDisabled = status.uploading || !field.uploadPath;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, label), field.uploadPathPrefix && !field.recordId && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      color: "grey60",
      mb: "sm"
    }, field.saveFirstMessage), /*#__PURE__*/React__default.default.createElement(ImageUploadDropzone, {
      multiple: field.isMultiple,
      disabled: dropzoneDisabled,
      onDropAccepted: files => void actions.handleFiles(files)
    }), status.uploading && /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null), status.error && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "error"
    }, status.error)), /*#__PURE__*/React__default.default.createElement(ImageUploadPreviewStrip, {
      previewUrls: previewUrls
    }), field.urls.length > 0 && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "default",
      style: THUMB_GRID_STYLE
    }, field.urls.map((url, i) => /*#__PURE__*/React__default.default.createElement(ImageUploadThumbnail, {
      key: url,
      url: url,
      variant: "edit",
      index: i,
      onRemove: actions.removeUrl
    }))));
  };

  const ImageUploadFieldShow = ({
    urls
  }) => {
    if (urls.length === 0) return null;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: THUMB_GRID_STYLE
    }, urls.map((url, i) => /*#__PURE__*/React__default.default.createElement(ImageUploadThumbnail, {
      key: url,
      url: url,
      variant: "show",
      index: i
    })));
  };

  const ImageUploadField = props => {
    const {
      where
    } = props;
    const state = useImageUploadField(props);
    if (where === 'edit') {
      return /*#__PURE__*/React__default.default.createElement(ImageUploadFieldEdit, state);
    }
    if (where === 'show' || where === 'list') {
      return /*#__PURE__*/React__default.default.createElement(ImageUploadFieldShow, {
        urls: state.field.urls
      });
    }
    return null;
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.LinksField = LinksField;
  AdminJS.UserComponents.AddressField = AddressField;
  AdminJS.UserComponents.ImageUploadField = ImageUploadField;

})(React, AdminJSDesignSystem, PropTypes);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvbGlua3MtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlTGlua3NGaWVsZC50cyIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtJdGVtL0xpbmtJdGVtLnRzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtzRmllbGQudHN4IiwiLi4vc3JjL2FkbWluL3V0aWxzL2FkZHJlc3MtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlQWRkcmVzc0ZpZWxkLnRzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvQWRkcmVzc0ZpZWxkLnRzeCIsIi4uL3NyYy91cGxvYWQvY29uc3RhbnRzLnRzIiwiLi4vc3JjL2FkbWluL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzLnRzIiwiLi4vc3JjL2FkbWluL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25maWcudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlSW1hZ2VVcGxvYWRGaWVsZC50cyIsIi4uL3NyYy9hZG1pbi9ob29rcy91c2VPYmplY3RVcmxzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9maWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9maWxlLXNlbGVjdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9hdHRyLWFjY2VwdC9kaXN0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRyb3B6b25lL2Rpc3QvZXMvdXRpbHMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcmVhY3QtZHJvcHpvbmUvZGlzdC9lcy9pbmRleC5qcyIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0ltYWdlVXBsb2FkL0ltYWdlVXBsb2FkRHJvcHpvbmUudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRUaHVtYm5haWwudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZEVkaXQudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZFNob3cudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZC50c3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgTElOS19LRVlTID0gW1xuICAnZmFjZWJvb2snLFxuICAnaW5zdGFncmFtJyxcbiAgJ2FpcmJuYicsXG4gICdib29raW5nJyxcbiAgJ3doYXRzYXBwJyxcbl0gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBMaW5rS2V5ID0gKHR5cGVvZiBMSU5LX0tFWVMpW251bWJlcl07XG5cbmV4cG9ydCB0eXBlIExpbmtzVmFsdWUgPSBQYXJ0aWFsPFJlY29yZDxMaW5rS2V5LCBzdHJpbmc+PjtcblxuZXhwb3J0IHR5cGUgTGlua3NGaWVsZFByb3BzID0ge1xuICBwcm9wZXJ0eTogeyBwYXRoOiBzdHJpbmcgfTtcbiAgcmVjb3JkPzogeyBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9IHwgbnVsbDtcbiAgb25DaGFuZ2U/OiAocGF0aDogc3RyaW5nLCB2YWx1ZTogdW5rbm93bikgPT4gdm9pZDtcbiAgd2hlcmU6ICdzaG93JyB8ICdsaXN0JyB8ICdlZGl0JyB8ICdmaWx0ZXInO1xufTtcbiIsImltcG9ydCB0eXBlIHsgTGlua0tleSwgTGlua3NWYWx1ZSB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcbmltcG9ydCB7IExJTktfS0VZUyB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcblxuZXhwb3J0IGNvbnN0IExBQkVMUzogUmVjb3JkPExpbmtLZXksIHN0cmluZz4gPSB7XG4gIGZhY2Vib29rOiAnRmFjZWJvb2snLFxuICBpbnN0YWdyYW06ICdJbnN0YWdyYW0nLFxuICBhaXJibmI6ICdBaXJibmInLFxuICBib29raW5nOiAnQm9va2luZy5jb20nLFxuICB3aGF0c2FwcDogJ1doYXRzQXBwJyxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxpbmtzKHZhbHVlOiB1bmtub3duKTogTGlua3NWYWx1ZSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4ge307XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGNvbnN0IG9iaiA9IHZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgIHJldHVybiBMSU5LX0tFWVMucmVkdWNlPExpbmtzVmFsdWU+KChhY2MsIGtleSkgPT4ge1xuICAgICAgY29uc3QgdiA9IG9ialtrZXldO1xuICAgICAgYWNjW2tleV0gPSB0eXBlb2YgdiA9PT0gJ3N0cmluZycgPyB2IDogJyc7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHZhbHVlKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICAgIHJldHVybiBwYXJzZUxpbmtzKHBhcnNlZCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG4gIHJldHVybiB7fTtcbn1cblxuLyoqIEdldCBsaW5rcyBmcm9tIHJlY29yZC5wYXJhbXM6IHN1cHBvcnRzIG5lc3RlZCAocGFyYW1zLmxpbmtzKSBvciBmbGF0dGVuZWQgKHBhcmFtc1snbGlua3MuZmFjZWJvb2snXSkuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlua3NGcm9tUGFyYW1zKFxuICBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkLFxuICBwYXRoOiBzdHJpbmcsXG4pOiBMaW5rc1ZhbHVlIHtcbiAgaWYgKCFwYXJhbXMpIHJldHVybiB7fTtcbiAgY29uc3QgbmVzdGVkID0gcGFyYW1zW3BhdGhdO1xuICBpZiAobmVzdGVkICE9IG51bGwgJiYgdHlwZW9mIG5lc3RlZCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkobmVzdGVkKSkge1xuICAgIHJldHVybiBwYXJzZUxpbmtzKG5lc3RlZCk7XG4gIH1cbiAgY29uc3QgcHJlZml4ID0gYCR7cGF0aH0uYDtcbiAgcmV0dXJuIExJTktfS0VZUy5yZWR1Y2U8TGlua3NWYWx1ZT4oKGFjYywga2V5KSA9PiB7XG4gICAgY29uc3QgdiA9IHBhcmFtc1tgJHtwcmVmaXh9JHtrZXl9YF07XG4gICAgYWNjW2tleV0gPSB0eXBlb2YgdiA9PT0gJ3N0cmluZycgPyB2IDogJyc7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuIiwiaW1wb3J0IHsgZ2V0TGlua3NGcm9tUGFyYW1zIH0gZnJvbSAnLi4vdXRpbHMvbGlua3MtZmllbGQudXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rc0ZpZWxkUHJvcHMgfSBmcm9tICcuLi90eXBlcy9saW5rcy1maWVsZC50eXBlcyc7XG5pbXBvcnQgdHlwZSB7IExpbmtLZXkgfSBmcm9tICcuLi90eXBlcy9saW5rcy1maWVsZC50eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VMaW5rc0ZpZWxkKHByb3BzOiBMaW5rc0ZpZWxkUHJvcHMpIHtcbiAgY29uc3QgeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHBhdGggPSBwcm9wZXJ0eS5wYXRoO1xuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcztcbiAgY29uc3QgbGlua3MgPSBnZXRMaW5rc0Zyb21QYXJhbXMocGFyYW1zLCBwYXRoKTtcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoa2V5OiBMaW5rS2V5LCB2YWx1ZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKCFvbkNoYW5nZSkgcmV0dXJuO1xuICAgIG9uQ2hhbmdlKHBhdGgsIHsgLi4ubGlua3MsIFtrZXldOiB2YWx1ZSB9KTtcbiAgfTtcblxuICByZXR1cm4geyBwYXRoLCBsaW5rcywgaGFuZGxlQ2hhbmdlIH07XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBGb3JtR3JvdXAsIExhYmVsLCBJbnB1dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgTEFCRUxTIH0gZnJvbSAnLi4vLi4vdXRpbHMvbGlua3MtZmllbGQudXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rS2V5IH0gZnJvbSAnLi4vLi4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMnO1xuXG50eXBlIExpbmtJdGVtRWRpdFByb3BzID0ge1xuICBwYXRoOiBzdHJpbmc7XG4gIGxpbmtLZXk6IExpbmtLZXk7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIG9uQ2hhbmdlOiAoa2V5OiBMaW5rS2V5LCB2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxudHlwZSBMaW5rSXRlbVNob3dQcm9wcyA9IHtcbiAgbGlua0tleTogTGlua0tleTtcbiAgdmFsdWU6IHN0cmluZztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rSXRlbUVkaXQoe1xuICBwYXRoLFxuICBsaW5rS2V5LFxuICB2YWx1ZSxcbiAgb25DaGFuZ2UsXG59OiBMaW5rSXRlbUVkaXRQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIGNvbnN0IGlkID0gYCR7cGF0aH0tJHtsaW5rS2V5fWA7XG4gIHJldHVybiAoXG4gICAgPEZvcm1Hcm91cCBtYj1cImxnXCI+XG4gICAgICA8TGFiZWwgaHRtbEZvcj17aWR9PntMQUJFTFNbbGlua0tleV19PC9MYWJlbD5cbiAgICAgIDxJbnB1dFxuICAgICAgICBpZD17aWR9XG4gICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgIG9uQ2hhbmdlKGxpbmtLZXksIChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBwbGFjZWhvbGRlcj17YGh0dHBzOi8vJHtsaW5rS2V5fS5jb20vLi4uYH1cbiAgICAgIC8+XG4gICAgPC9Gb3JtR3JvdXA+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rSXRlbVNob3coe1xuICBsaW5rS2V5LFxuICB2YWx1ZSxcbn06IExpbmtJdGVtU2hvd1Byb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHtcbiAgcmV0dXJuIChcbiAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgPExhYmVsPntMQUJFTFNbbGlua0tleV19PC9MYWJlbD5cbiAgICAgIDxCb3ggbXQ9XCJzbVwiPlxuICAgICAgICA8YSBocmVmPXt2YWx1ZX0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICAgIHt2YWx1ZX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VMaW5rc0ZpZWxkIH0gZnJvbSAnLi4vaG9va3MvdXNlTGlua3NGaWVsZCc7XG5pbXBvcnQgeyBMaW5rSXRlbUVkaXQsIExpbmtJdGVtU2hvdyB9IGZyb20gJy4vTGlua0l0ZW0vTGlua0l0ZW0nO1xuaW1wb3J0IHsgTElOS19LRVlTLCBMaW5rc0ZpZWxkUHJvcHMgfSBmcm9tICcuLi90eXBlcy9saW5rcy1maWVsZC50eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBMaW5rc0ZpZWxkOiBSZWFjdC5GQzxMaW5rc0ZpZWxkUHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgd2hlcmUgfSA9IHByb3BzO1xuICBjb25zdCB7IHBhdGgsIGxpbmtzLCBoYW5kbGVDaGFuZ2UgfSA9IHVzZUxpbmtzRmllbGQocHJvcHMpO1xuXG4gIGlmICh3aGVyZSA9PT0gJ2VkaXQnKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3g+XG4gICAgICAgIHtMSU5LX0tFWVMubWFwKChrZXkpID0+IChcbiAgICAgICAgICA8TGlua0l0ZW1FZGl0XG4gICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgIHBhdGg9e3BhdGh9XG4gICAgICAgICAgICBsaW5rS2V5PXtrZXl9XG4gICAgICAgICAgICB2YWx1ZT17bGlua3Nba2V5XSA/PyAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgaWYgKHdoZXJlID09PSAnc2hvdycgfHwgd2hlcmUgPT09ICdsaXN0Jykge1xuICAgIGNvbnN0IGZpbGxlZCA9IExJTktfS0VZUy5maWx0ZXIoKGspID0+IGxpbmtzW2tdKTtcbiAgICBpZiAoZmlsbGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3g+XG4gICAgICAgIHtmaWxsZWQubWFwKChrZXkpID0+IChcbiAgICAgICAgICA8TGlua0l0ZW1TaG93IGtleT17a2V5fSBsaW5rS2V5PXtrZXl9IHZhbHVlPXtsaW5rc1trZXldID8/ICcnfSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExpbmtzRmllbGQ7XG4iLCJpbXBvcnQgdHlwZSB7IENvbnRhY3RBZGRyZXNzVmFsdWUgfSBmcm9tICcuLi90eXBlcy9hZGRyZXNzLWZpZWxkLnR5cGVzJztcblxuY29uc3QgREVGQVVMVF9BRERSRVNTOiBDb250YWN0QWRkcmVzc1ZhbHVlID0geyBsYWJlbDogJycsIHVybDogJycgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQWRkcmVzcyh2YWx1ZTogdW5rbm93bik6IENvbnRhY3RBZGRyZXNzVmFsdWUge1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHsgLi4uREVGQVVMVF9BRERSRVNTIH07XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGNvbnN0IG9iaiA9IHZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogdHlwZW9mIG9iai5sYWJlbCA9PT0gJ3N0cmluZycgPyBvYmoubGFiZWwgOiAnJyxcbiAgICAgIHVybDogdHlwZW9mIG9iai51cmwgPT09ICdzdHJpbmcnID8gb2JqLnVybCA6ICcnLFxuICAgIH07XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZSh2YWx1ZSkgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgICByZXR1cm4gcGFyc2VBZGRyZXNzKHBhcnNlZCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4geyAuLi5ERUZBVUxUX0FERFJFU1MgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgLi4uREVGQVVMVF9BRERSRVNTIH07XG59XG5cbi8qKiBHZXQgYWRkcmVzcyBmcm9tIHJlY29yZC5wYXJhbXM6IHN1cHBvcnRzIG5lc3RlZCBvciBmbGF0dGVuZWQga2V5cy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZGRyZXNzRnJvbVBhcmFtcyhcbiAgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCxcbiAgcGF0aDogc3RyaW5nLFxuKTogQ29udGFjdEFkZHJlc3NWYWx1ZSB7XG4gIGlmICghcGFyYW1zKSByZXR1cm4geyAuLi5ERUZBVUxUX0FERFJFU1MgfTtcbiAgY29uc3QgbmVzdGVkID0gcGFyYW1zW3BhdGhdO1xuICBpZiAobmVzdGVkICE9IG51bGwgJiYgdHlwZW9mIG5lc3RlZCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkobmVzdGVkKSkge1xuICAgIHJldHVybiBwYXJzZUFkZHJlc3MobmVzdGVkKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiB0eXBlb2YgcGFyYW1zW2Ake3BhdGh9LmxhYmVsYF0gPT09ICdzdHJpbmcnID8gKHBhcmFtc1tgJHtwYXRofS5sYWJlbGBdIGFzIHN0cmluZykgOiAnJyxcbiAgICB1cmw6IHR5cGVvZiBwYXJhbXNbYCR7cGF0aH0udXJsYF0gPT09ICdzdHJpbmcnID8gKHBhcmFtc1tgJHtwYXRofS51cmxgXSBhcyBzdHJpbmcpIDogJycsXG4gIH07XG59XG4iLCJpbXBvcnQgeyBnZXRBZGRyZXNzRnJvbVBhcmFtcyB9IGZyb20gJy4uL3V0aWxzL2FkZHJlc3MtZmllbGQudXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBBZGRyZXNzRmllbGRQcm9wcywgQ29udGFjdEFkZHJlc3NWYWx1ZSB9IGZyb20gJy4uL3R5cGVzL2FkZHJlc3MtZmllbGQudHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQWRkcmVzc0ZpZWxkKHByb3BzOiBBZGRyZXNzRmllbGRQcm9wcykge1xuICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wcztcbiAgY29uc3QgcGF0aCA9IHByb3BlcnR5LnBhdGg7XG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zO1xuICBjb25zdCBhZGRyZXNzID0gZ2V0QWRkcmVzc0Zyb21QYXJhbXMocGFyYW1zLCBwYXRoKTtcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoZmllbGQ6IGtleW9mIENvbnRhY3RBZGRyZXNzVmFsdWUsIHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIW9uQ2hhbmdlKSByZXR1cm47XG4gICAgb25DaGFuZ2UocGF0aCwgeyAuLi5hZGRyZXNzLCBbZmllbGRdOiB2YWx1ZSB9KTtcbiAgfTtcblxuICByZXR1cm4geyBwYXRoLCBhZGRyZXNzLCBoYW5kbGVDaGFuZ2UgfTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEZvcm1Hcm91cCwgTGFiZWwsIElucHV0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VBZGRyZXNzRmllbGQgfSBmcm9tICcuLi9ob29rcy91c2VBZGRyZXNzRmllbGQnO1xuaW1wb3J0IHR5cGUgeyBBZGRyZXNzRmllbGRQcm9wcyB9IGZyb20gJy4uL3R5cGVzL2FkZHJlc3MtZmllbGQudHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQWRkcmVzc0ZpZWxkOiBSZWFjdC5GQzxBZGRyZXNzRmllbGRQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyB3aGVyZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHsgcGF0aCwgYWRkcmVzcywgaGFuZGxlQ2hhbmdlIH0gPSB1c2VBZGRyZXNzRmllbGQocHJvcHMpO1xuXG4gIGlmICh3aGVyZSA9PT0gJ2VkaXQnKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3g+XG4gICAgICAgIDxGb3JtR3JvdXAgbWI9XCJsZ1wiPlxuICAgICAgICAgIDxMYWJlbCBodG1sRm9yPXtgJHtwYXRofS1sYWJlbGB9PkxhYmVsPC9MYWJlbD5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIGlkPXtgJHtwYXRofS1sYWJlbGB9XG4gICAgICAgICAgICB2YWx1ZT17YWRkcmVzcy5sYWJlbH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKCdsYWJlbCcsIChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBLeWl2LCB2dWwuIEtocmVzaGNoYXR5ayAxXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L0Zvcm1Hcm91cD5cbiAgICAgICAgPEZvcm1Hcm91cCBtYj1cImxnXCI+XG4gICAgICAgICAgPExhYmVsIGh0bWxGb3I9e2Ake3BhdGh9LXVybGB9PlVSTDwvTGFiZWw+XG4gICAgICAgICAgPElucHV0XG4gICAgICAgICAgICBpZD17YCR7cGF0aH0tdXJsYH1cbiAgICAgICAgICAgIHZhbHVlPXthZGRyZXNzLnVybH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKCd1cmwnLCAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHBzOi8vbWFwcy5leGFtcGxlLmNvbS8uLi5cIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRm9ybUdyb3VwPlxuICAgICAgPC9Cb3g+XG4gICAgKTtcbiAgfVxuXG4gIGlmICh3aGVyZSA9PT0gJ3Nob3cnIHx8IHdoZXJlID09PSAnbGlzdCcpIHtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGFkZHJlc3MubGFiZWwgfHwgYWRkcmVzcy51cmw7XG4gICAgaWYgKCFoYXNWYWx1ZSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3g+XG4gICAgICAgIHthZGRyZXNzLmxhYmVsICYmIChcbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPkxhYmVsPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggbXQ9XCJzbVwiPnthZGRyZXNzLmxhYmVsfTwvQm94PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApfVxuICAgICAgICB7YWRkcmVzcy51cmwgJiYgKFxuICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICA8TGFiZWw+VVJMPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggbXQ9XCJzbVwiPlxuICAgICAgICAgICAgICA8YSBocmVmPXthZGRyZXNzLnVybH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICAgIHthZGRyZXNzLnVybH1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICl9XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBZGRyZXNzRmllbGQ7XG4iLCJpbXBvcnQgeyBJbWFnZU1pbWVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQUxMT1dFRF9NSU1FUyA9IFtcbiAgSW1hZ2VNaW1lVHlwZS5KUEVHLFxuICBJbWFnZU1pbWVUeXBlLlBORyxcbiAgSW1hZ2VNaW1lVHlwZS5XRUJQLFxuICBJbWFnZU1pbWVUeXBlLkdJRixcbl0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBNQVhfU0laRSA9IDEwICogMTAyNCAqIDEwMjQ7IC8vIDEwTUJcblxuZXhwb3J0IGNvbnN0IFBBVEhfUEFUVEVSTiA9IC9eW2EtekEtWjAtOV8uLV0rKFxcL1thLXpBLVowLTlfLi1dKykrJC87XG5cbmV4cG9ydCBjb25zdCBCVUNLRVQgPSAnYXBhcnRtZW50cyc7XG4iLCJpbXBvcnQgeyBJbWFnZU1pbWVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvdHlwZXMnO1xuXG4vKiogUHVibGljIGxhYmVscyBmb3IgdGhlIGZpZWxkLiAqL1xuZXhwb3J0IGNvbnN0IExBQkVMUyA9IHtcbiAgbWFpblBob3RvOiAnTWFpbiBwaG90bycsXG4gIHBob3RvczogJ1Bob3RvcyAobXVsdGlwbGUpJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBVUExPQURfVVJMID0gJy9hcGkvdXBsb2FkJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX1NBVkVfRklSU1RfTUVTU0FHRSA9XG4gICdTYXZlIHRoZSByZWNvcmQgZmlyc3Qgc28gZmlsZXMgYXJlIHN0b3JlZCBpbiBpdHMgZm9sZGVyLic7XG5leHBvcnQgY29uc3QgSU1BR0VfQUNDRVBUID0gW1xuICBJbWFnZU1pbWVUeXBlLkpQRUcsXG4gIEltYWdlTWltZVR5cGUuUE5HLFxuICBJbWFnZU1pbWVUeXBlLldFQlAsXG4gIEltYWdlTWltZVR5cGUuR0lGLFxuXSBhcyBjb25zdDtcbmV4cG9ydCBjb25zdCBVUExPQURfRVJST1JfRkFMTEJBQ0sgPSAnVXBsb2FkIGZhaWxlZCc7XG5cbi8qKiBNSU1FIHR5cGUgdG8gZXh0ZW5zaW9ucyBtYXAgZm9yIHJlYWN0LWRyb3B6b25lIGFjY2VwdC4gKi9cbmV4cG9ydCBjb25zdCBJTUFHRV9BQ0NFUFRfTUFQID0ge1xuICAnaW1hZ2UvanBlZyc6IFsnLmpwZycsICcuanBlZyddLFxuICAnaW1hZ2UvcG5nJzogWycucG5nJ10sXG4gICdpbWFnZS93ZWJwJzogWycud2VicCddLFxuICAnaW1hZ2UvZ2lmJzogWycuZ2lmJ10sXG59IGFzIGNvbnN0O1xuXG4vKiogVGh1bWJuYWlsIHNpemUgaW4gcHg7IHVzZWQgZm9yIGdyaWQgYW5kIGNhcmQgd2lkdGguICovXG5leHBvcnQgY29uc3QgVEhVTUJfU0laRSA9IDE2MDtcblxuLyoqIEdyaWQgbGF5b3V0IGZvciB0aHVtYm5haWwgbGlzdHMgKGVkaXQgYW5kIHNob3cpLiAqL1xuZXhwb3J0IGNvbnN0IFRIVU1CX0dSSURfU1RZTEUgPSB7XG4gIGRpc3BsYXk6ICdncmlkJyxcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgxNjBweCwgMWZyKSknLFxuICBnYXA6IDEyLFxufSBhcyBjb25zdDtcblxuLyoqIFByZXZpZXcgaW1hZ2Ugc3R5bGUgd2hpbGUgZmlsZXMgYXJlIHVwbG9hZGluZy4gKi9cbmV4cG9ydCBjb25zdCBVUExPQURJTkdfUFJFVklFV19TVFlMRSA9IHtcbiAgbWF4SGVpZ2h0OiAyMDAsXG4gIG9iamVjdEZpdDogJ2NvbnRhaW4nIGFzIGNvbnN0LFxufTtcbiIsImltcG9ydCB7IEJVQ0tFVCB9IGZyb20gJy4uLy4uLy4uL3VwbG9hZC9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgVVBMT0FEX1VSTCxcbiAgVVBMT0FEX0VSUk9SX0ZBTExCQUNLLFxufSBmcm9tICcuL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xuXG4vLyAtLS0gUGFyYW1zIC8gcmVjb3JkIGhlbHBlcnMgLS0tXG5cbi8qKlxuICogUmVhZCBpbWFnZSBVUkwocykgZnJvbSByZWNvcmQgcGFyYW1zLlxuICogQWNjZXB0cyBwYXJhbXNbcGF0aF0gYXMgYXJyYXkgb3Igc3RyaW5nLCBhbmQgcGFyYW1zW3BhdGguMF0sIHBhcmFtc1twYXRoLjFdLCDigKZcbiAqIGZvciBsZWdhY3kgZm9ybSBwYXlsb2Fkcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFVybHNGcm9tUGFyYW1zKFxuICBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkLFxuICBwYXRoOiBzdHJpbmcsXG4gIGlzTXVsdGlwbGU6IGJvb2xlYW4sXG4pOiBzdHJpbmdbXSB7XG4gIGlmIChpc011bHRpcGxlKSByZXR1cm4gZ2V0QXJyYXlGcm9tUGFyYW1zKHBhcmFtcywgcGF0aCk7XG4gIGNvbnN0IHYgPSBwYXJhbXM/LltwYXRoXTtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSAnc3RyaW5nJyAmJiB2ID8gW3ZdIDogW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWNvcmRJZChcbiAgcmVjb3JkOiB7IHBhcmFtcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXM7XG4gIHJldHVybiB0eXBlb2YgcGFyYW1zPy5pZCA9PT0gJ3N0cmluZycgPyBwYXJhbXMuaWQgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZVN0cmluZ0FycmF5KHZhbHVlOiB1bmtub3duKTogc3RyaW5nW10ge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUuZmlsdGVyKCh2KTogdiBpcyBzdHJpbmcgPT4gdHlwZW9mIHYgPT09ICdzdHJpbmcnKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZSkgcmV0dXJuIFt2YWx1ZV07XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0QXJyYXlGcm9tUGFyYW1zKFxuICBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkLFxuICBwYXRoOiBzdHJpbmcsXG4pOiBzdHJpbmdbXSB7XG4gIGlmICghcGFyYW1zKSByZXR1cm4gW107XG4gIGNvbnN0IGRpcmVjdCA9IHBhcmFtc1twYXRoXTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGlyZWN0KSkge1xuICAgIHJldHVybiBlbnN1cmVTdHJpbmdBcnJheShkaXJlY3QpO1xuICB9XG4gIGNvbnN0IGNvbGxlY3RlZDogc3RyaW5nW10gPSBbXTtcbiAgbGV0IGkgPSAwO1xuICBmb3IgKDs7KSB7XG4gICAgY29uc3Qga2V5ID0gYCR7cGF0aH0uJHtpfWA7XG4gICAgY29uc3QgdiA9IHBhcmFtc1trZXldO1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCkgYnJlYWs7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJyAmJiB2KSBjb2xsZWN0ZWQucHVzaCh2KTtcbiAgICBpICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvbGxlY3RlZDtcbn1cblxuLy8gLS0tIFBhdGggYW5kIGVycm9yIGhlbHBlcnMgLS0tXG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFVwbG9hZFBhdGgoXG4gIHVwbG9hZFBhdGhQcmVmaXg6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgcmVjb3JkSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXVwbG9hZFBhdGhQcmVmaXggfHwgdHlwZW9mIHVwbG9hZFBhdGhQcmVmaXggIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc2VnbWVudCA9IChyZWNvcmRJZD8udHJpbSgpIHx8ICdfbmV3JykucmVwbGFjZSgvW15hLXpBLVowLTlfLi1dL2csICcnKTtcbiAgY29uc3QgcHJlZml4ID0gdXBsb2FkUGF0aFByZWZpeC50cmltKCkucmVwbGFjZSgvW15hLXpBLVowLTlfLi1dL2csICcnKTtcbiAgcmV0dXJuIHByZWZpeCA/IGAke3ByZWZpeH0vJHtzZWdtZW50fWAgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKFxuICBlcnI6IHVua25vd24sXG4gIGZhbGxiYWNrID0gVVBMT0FEX0VSUk9SX0ZBTExCQUNLLFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBmYWxsYmFjaztcbn1cblxuLy8gLS0tIFVwbG9hZCAoc2luZ2xlIGhlbHBlcikgLS0tXG5cbmFzeW5jIGZ1bmN0aW9uIHVwbG9hZEZpbGUoXG4gIGZpbGU6IEZpbGUsXG4gIHVwbG9hZFBhdGg6IHN0cmluZyB8IG51bGwsXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCB1cmwgPSBuZXcgVVJMKFVQTE9BRF9VUkwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICBpZiAodXBsb2FkUGF0aCkge1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdwYXRoJywgdXBsb2FkUGF0aCk7XG4gIH1cbiAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybC50b1N0cmluZygpLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgYm9keTogZm9ybURhdGEsXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gIH0pO1xuXG4gIGlmICghcmVzLm9rKSB7XG4gICAgY29uc3QgZXJyID0gKGF3YWl0IHJlc1xuICAgICAgLmpzb24oKVxuICAgICAgLmNhdGNoKCgpID0+ICh7IG1lc3NhZ2U6IHJlcy5zdGF0dXNUZXh0IH0pKSkgYXMge1xuICAgICAgbWVzc2FnZT86IHN0cmluZztcbiAgICB9O1xuICAgIHRocm93IG5ldyBFcnJvcihlcnIubWVzc2FnZSA/PyAnVXBsb2FkIGZhaWxlZCcpO1xuICB9XG4gIGNvbnN0IGRhdGEgPSAoYXdhaXQgcmVzLmpzb24oKSkgYXMgeyB1cmw6IHN0cmluZyB9O1xuICByZXR1cm4gZGF0YS51cmw7XG59XG5cbi8qKlxuICogRXh0cmFjdCBzdG9yYWdlIGtleSBmcm9tIGEgU3VwYWJhc2UgcHVibGljIFVSTC5cbiAqIFVSTCBmb3JtYXQ6IC4uLi9zdG9yYWdlL3YxL29iamVjdC9wdWJsaWMvPGJ1Y2tldD4vPGtleT5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0b3JhZ2VLZXlGcm9tUHVibGljVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aG5hbWUgPSBuZXcgVVJMKHVybCkucGF0aG5hbWU7XG4gICAgY29uc3QgcHJlZml4ID0gYC9zdG9yYWdlL3YxL29iamVjdC9wdWJsaWMvJHtCVUNLRVR9L2A7XG4gICAgaWYgKCFwYXRobmFtZS5zdGFydHNXaXRoKHByZWZpeCkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBwYXRobmFtZS5zbGljZShwcmVmaXgubGVuZ3RoKSB8fCBudWxsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIERlbGV0ZSBhIGZpbGUgZnJvbSBzdG9yYWdlIGJ5IGl0cyBwdWJsaWMgVVJMIChvbmx5IHdvcmtzIGZvciBTdXBhYmFzZSBwdWJsaWMgVVJMcyBmb3Igb3VyIGJ1Y2tldCkuXG4gKiBOby1vcCBpZiB0aGUgVVJMIGlzIG5vdCBhIHZhbGlkIHN0b3JhZ2UgVVJMIChlLmcuIGJsb2IgVVJMKS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUZpbGVCeVVybCh1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBrZXkgPSBnZXRTdG9yYWdlS2V5RnJvbVB1YmxpY1VybCh1cmwpO1xuICBpZiAoIWtleSkgcmV0dXJuO1xuICBjb25zdCBkZWxldGVVcmwgPSBuZXcgVVJMKFVQTE9BRF9VUkwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICBkZWxldGVVcmwuc2VhcmNoUGFyYW1zLnNldCgncGF0aCcsIGtleSk7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGRlbGV0ZVVybC50b1N0cmluZygpLCB7XG4gICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgfSk7XG4gIGlmICghcmVzLm9rKSB7XG4gICAgY29uc3QgZXJyID0gKGF3YWl0IHJlc1xuICAgICAgLmpzb24oKVxuICAgICAgLmNhdGNoKCgpID0+ICh7IG1lc3NhZ2U6IHJlcy5zdGF0dXNUZXh0IH0pKSkgYXMgeyBtZXNzYWdlPzogc3RyaW5nIH07XG4gICAgdGhyb3cgbmV3IEVycm9yKGVyci5tZXNzYWdlID8/ICdEZWxldGUgZmFpbGVkJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBVcGxvYWQgZmlsZXMgYW5kIHJldHVybiB0aGUgbmV4dCB2YWx1ZSBmb3IgdGhlIGZpZWxkOiBzaW5nbGUgVVJMIG9yIGFycmF5IG9mIFVSTHMgYXBwZW5kZWQgdG8gY3VycmVudFVybHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGxvYWRGaWxlc0FuZEJ1aWxkTmV4dFZhbHVlKFxuICBmaWxlczogRmlsZUxpc3QgfCBGaWxlW10sXG4gIHVwbG9hZFBhdGg6IHN0cmluZyB8IG51bGwsXG4gIGlzTXVsdGlwbGU6IGJvb2xlYW4sXG4gIGN1cnJlbnRVcmxzOiBzdHJpbmdbXSxcbik6IFByb21pc2U8c3RyaW5nIHwgc3RyaW5nW10+IHtcbiAgY29uc3QgbGlzdCA9IEFycmF5LmZyb20oZmlsZXMpO1xuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gaXNNdWx0aXBsZSA/IGN1cnJlbnRVcmxzIDogJyc7XG4gIH1cbiAgY29uc3QgdXJsczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdXJscy5wdXNoKGF3YWl0IHVwbG9hZEZpbGUobGlzdFtpXSwgdXBsb2FkUGF0aCkpO1xuICB9XG4gIGlmIChpc011bHRpcGxlKSB7XG4gICAgcmV0dXJuIFsuLi5jdXJyZW50VXJscywgLi4udXJsc107XG4gIH1cbiAgcmV0dXJuIHVybHNbMF07XG59XG4iLCJpbXBvcnQgeyBERUZBVUxUX1NBVkVfRklSU1RfTUVTU0FHRSB9IGZyb20gJy4vaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IEltYWdlVXBsb2FkRmllbGRQcm9wcyB9IGZyb20gJy4uLy4uL3R5cGVzL2ltYWdlLXVwbG9hZC1maWVsZC50eXBlcyc7XG5leHBvcnQgdHlwZSBGaWVsZENvbmZpZyA9IHtcbiAgcGF0aDogc3RyaW5nO1xuICBpc011bHRpcGxlOiBib29sZWFuO1xuICB1cGxvYWRQYXRoUHJlZml4OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHNhdmVGaXJzdE1lc3NhZ2U6IHN0cmluZztcbn07XG5cbi8qKlxuICogQnVpbGQgZmllbGQgY29uZmlnIGZyb20gQWRtaW5KUyBwcm9wZXJ0eS5cbiAqIE11bHRpcGxlIHVwbG9hZCBpcyBlbmFibGVkIHdoZW4gcGF0aCBpcyBcInBob3Rvc1wiICh1c2VkIGZvciBhcGFydG1lbnQgcGhvdG9zKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkQ29uZmlnKFxuICBwcm9wZXJ0eTogSW1hZ2VVcGxvYWRGaWVsZFByb3BzWydwcm9wZXJ0eSddLFxuKTogRmllbGRDb25maWcge1xuICByZXR1cm4ge1xuICAgIHBhdGg6IHByb3BlcnR5LnBhdGgsXG4gICAgaXNNdWx0aXBsZTogcHJvcGVydHkucGF0aCA9PT0gJ3Bob3RvcycsXG4gICAgdXBsb2FkUGF0aFByZWZpeDogcHJvcGVydHkuY3VzdG9tPy51cGxvYWRQYXRoUHJlZml4LFxuICAgIHNhdmVGaXJzdE1lc3NhZ2U6XG4gICAgICBwcm9wZXJ0eS5jdXN0b20/LnNhdmVGaXJzdE1lc3NhZ2UgPz8gREVGQVVMVF9TQVZFX0ZJUlNUX01FU1NBR0UsXG4gIH07XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIGJ1aWxkVXBsb2FkUGF0aCxcbiAgZ2V0VXJsc0Zyb21QYXJhbXMsXG4gIGdldFJlY29yZElkLFxuICB1cGxvYWRGaWxlc0FuZEJ1aWxkTmV4dFZhbHVlLFxuICBnZXRFcnJvck1lc3NhZ2UsXG4gIGRlbGV0ZUZpbGVCeVVybCxcbn0gZnJvbSAnLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC51dGlscyc7XG5pbXBvcnQgeyBnZXRGaWVsZENvbmZpZyB9IGZyb20gJy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uZmlnJztcbmltcG9ydCB0eXBlIHsgSW1hZ2VVcGxvYWRGaWVsZFByb3BzIH0gZnJvbSAnLi4vdHlwZXMvaW1hZ2UtdXBsb2FkLWZpZWxkLnR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUltYWdlVXBsb2FkRmllbGQocHJvcHM6IEltYWdlVXBsb2FkRmllbGRQcm9wcykge1xuICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wcztcblxuICBjb25zdCBjb25maWcgPSBnZXRGaWVsZENvbmZpZyhwcm9wZXJ0eSk7XG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXM7XG4gIGNvbnN0IHJlY29yZElkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcbiAgY29uc3QgdXBsb2FkUGF0aCA9IGJ1aWxkVXBsb2FkUGF0aChjb25maWcudXBsb2FkUGF0aFByZWZpeCwgcmVjb3JkSWQpO1xuICBjb25zdCB1cmxzID0gZ2V0VXJsc0Zyb21QYXJhbXMocGFyYW1zLCBjb25maWcucGF0aCwgY29uZmlnLmlzTXVsdGlwbGUpO1xuXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFt1cGxvYWRpbmdGaWxlcywgc2V0VXBsb2FkaW5nRmlsZXNdID0gdXNlU3RhdGU8RmlsZVtdPihbXSk7XG5cbiAgY29uc3QgaGFuZGxlRmlsZXMgPSBhc3luYyAoZmlsZXM6IEZpbGVbXSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghZmlsZXMubGVuZ3RoIHx8ICFvbkNoYW5nZSkgcmV0dXJuO1xuXG4gICAgc2V0RXJyb3IobnVsbCk7XG4gICAgc2V0VXBsb2FkaW5nKHRydWUpO1xuICAgIHNldFVwbG9hZGluZ0ZpbGVzKGZpbGVzKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbmV4dFZhbHVlID0gYXdhaXQgdXBsb2FkRmlsZXNBbmRCdWlsZE5leHRWYWx1ZShcbiAgICAgICAgZmlsZXMsXG4gICAgICAgIHVwbG9hZFBhdGgsXG4gICAgICAgIGNvbmZpZy5pc011bHRpcGxlLFxuICAgICAgICB1cmxzLFxuICAgICAgKTtcbiAgICAgIG9uQ2hhbmdlKGNvbmZpZy5wYXRoLCBuZXh0VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZ2V0RXJyb3JNZXNzYWdlKGVycikpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xuICAgICAgc2V0VXBsb2FkaW5nRmlsZXMoW10pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW1vdmVVcmwgPSAoaW5kZXg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmICghb25DaGFuZ2UpIHJldHVybjtcbiAgICBjb25zdCB1cmxUb1JlbW92ZSA9IHVybHNbaW5kZXhdO1xuICAgIGlmICh1cmxUb1JlbW92ZSkge1xuICAgICAgdm9pZCBkZWxldGVGaWxlQnlVcmwodXJsVG9SZW1vdmUpLmNhdGNoKCgpID0+IHtcbiAgICAgICAgLy8gRmlyZS1hbmQtZm9yZ2V0OiBpbWFnZSBpcyByZW1vdmVkIGZyb20gZm9ybSBlaXRoZXIgd2F5XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICBjb25zdCBuZXh0ID0gdXJscy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KTtcbiAgICAgIG9uQ2hhbmdlKGNvbmZpZy5wYXRoLCBuZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25DaGFuZ2UoY29uZmlnLnBhdGgsICcnKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBmaWVsZDoge1xuICAgICAgcGF0aDogY29uZmlnLnBhdGgsXG4gICAgICBpc011bHRpcGxlOiBjb25maWcuaXNNdWx0aXBsZSxcbiAgICAgIHVybHMsXG4gICAgICB1cGxvYWRpbmdGaWxlcyxcbiAgICAgIHVwbG9hZFBhdGgsXG4gICAgICB1cGxvYWRQYXRoUHJlZml4OiBjb25maWcudXBsb2FkUGF0aFByZWZpeCxcbiAgICAgIHJlY29yZElkLFxuICAgICAgc2F2ZUZpcnN0TWVzc2FnZTogY29uZmlnLnNhdmVGaXJzdE1lc3NhZ2UsXG4gICAgfSxcbiAgICBzdGF0dXM6IHsgdXBsb2FkaW5nLCBlcnJvciB9LFxuICAgIGFjdGlvbnM6IHsgaGFuZGxlRmlsZXMsIHJlbW92ZVVybCB9LFxuICB9O1xufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBSZXR1cm5zIG9iamVjdCBVUkxzIGZvciB0aGUgZ2l2ZW4gZmlsZXMgYW5kIHJldm9rZXMgdGhlbSBvbiBjbGVhbnVwLlxuICogVXNlIGZvciBwcmV2aWV3aW5nIEZpbGUgb2JqZWN0cyBiZWZvcmUgdXBsb2FkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlT2JqZWN0VXJscyhmaWxlczogRmlsZVtdKTogc3RyaW5nW10ge1xuICBjb25zdCBbdXJscywgc2V0VXJsc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc2V0VXJscyhbXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5leHQgPSBmaWxlcy5tYXAoKGYpID0+IFVSTC5jcmVhdGVPYmplY3RVUkwoZikpO1xuICAgIHNldFVybHMobmV4dCk7XG4gICAgcmV0dXJuICgpID0+IG5leHQuZm9yRWFjaCgodXJsKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCkpO1xuICB9LCBbZmlsZXNdKTtcblxuICByZXR1cm4gdXJscztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DT01NT05fTUlNRV9UWVBFUyA9IHZvaWQgMDtcbmV4cG9ydHMudG9GaWxlV2l0aFBhdGggPSB0b0ZpbGVXaXRoUGF0aDtcbmV4cG9ydHMuQ09NTU9OX01JTUVfVFlQRVMgPSBuZXcgTWFwKFtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ3V6emxlL3BzcjcvYmxvYi8yZDkyNjA3OTllNzEzZjFjNDc1ZDNjNWZkYzNkNjU2MWZmNzQ0MWIyL3NyYy9NaW1lVHlwZS5waHBcbiAgICBbJzFrbScsICdhcHBsaWNhdGlvbi92bmQuMTAwMG1pbmRzLmRlY2lzaW9uLW1vZGVsK3htbCddLFxuICAgIFsnM2RtbCcsICd0ZXh0L3ZuZC5pbjNkLjNkbWwnXSxcbiAgICBbJzNkcycsICdpbWFnZS94LTNkcyddLFxuICAgIFsnM2cyJywgJ3ZpZGVvLzNncHAyJ10sXG4gICAgWyczZ3AnLCAndmlkZW8vM2dwJ10sXG4gICAgWyczZ3BwJywgJ3ZpZGVvLzNncHAnXSxcbiAgICBbJzNtZicsICdtb2RlbC8zbWYnXSxcbiAgICBbJzd6JywgJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCddLFxuICAgIFsnN3ppcCcsICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnXSxcbiAgICBbJzEyMycsICdhcHBsaWNhdGlvbi92bmQubG90dXMtMS0yLTMnXSxcbiAgICBbJ2FhYicsICdhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtYmluJ10sXG4gICAgWydhYWMnLCAnYXVkaW8veC1hY2MnXSxcbiAgICBbJ2FhbScsICdhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtbWFwJ10sXG4gICAgWydhYXMnLCAnYXBwbGljYXRpb24veC1hdXRob3J3YXJlLXNlZyddLFxuICAgIFsnYWJ3JywgJ2FwcGxpY2F0aW9uL3gtYWJpd29yZCddLFxuICAgIFsnYWMnLCAnYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5hYyt4bWwnXSxcbiAgICBbJ2FjMycsICdhdWRpby9hYzMnXSxcbiAgICBbJ2FjYycsICdhcHBsaWNhdGlvbi92bmQuYW1lcmljYW5keW5hbWljcy5hY2MnXSxcbiAgICBbJ2FjZScsICdhcHBsaWNhdGlvbi94LWFjZS1jb21wcmVzc2VkJ10sXG4gICAgWydhY3UnLCAnYXBwbGljYXRpb24vdm5kLmFjdWNvYm9sJ10sXG4gICAgWydhY3V0YycsICdhcHBsaWNhdGlvbi92bmQuYWN1Y29ycCddLFxuICAgIFsnYWRwJywgJ2F1ZGlvL2FkcGNtJ10sXG4gICAgWydhZXAnLCAnYXBwbGljYXRpb24vdm5kLmF1ZGlvZ3JhcGgnXSxcbiAgICBbJ2FmbScsICdhcHBsaWNhdGlvbi94LWZvbnQtdHlwZTEnXSxcbiAgICBbJ2FmcCcsICdhcHBsaWNhdGlvbi92bmQuaWJtLm1vZGNhcCddLFxuICAgIFsnYWhlYWQnLCAnYXBwbGljYXRpb24vdm5kLmFoZWFkLnNwYWNlJ10sXG4gICAgWydhaScsICdhcHBsaWNhdGlvbi9wZGYnXSxcbiAgICBbJ2FpZicsICdhdWRpby94LWFpZmYnXSxcbiAgICBbJ2FpZmMnLCAnYXVkaW8veC1haWZmJ10sXG4gICAgWydhaWZmJywgJ2F1ZGlvL3gtYWlmZiddLFxuICAgIFsnYWlyJywgJ2FwcGxpY2F0aW9uL3ZuZC5hZG9iZS5haXItYXBwbGljYXRpb24taW5zdGFsbGVyLXBhY2thZ2UremlwJ10sXG4gICAgWydhaXQnLCAnYXBwbGljYXRpb24vdm5kLmR2Yi5haXQnXSxcbiAgICBbJ2FtaScsICdhcHBsaWNhdGlvbi92bmQuYW1pZ2EuYW1pJ10sXG4gICAgWydhbXInLCAnYXVkaW8vYW1yJ10sXG4gICAgWydhcGsnLCAnYXBwbGljYXRpb24vdm5kLmFuZHJvaWQucGFja2FnZS1hcmNoaXZlJ10sXG4gICAgWydhcG5nJywgJ2ltYWdlL2FwbmcnXSxcbiAgICBbJ2FwcGNhY2hlJywgJ3RleHQvY2FjaGUtbWFuaWZlc3QnXSxcbiAgICBbJ2FwcGxpY2F0aW9uJywgJ2FwcGxpY2F0aW9uL3gtbXMtYXBwbGljYXRpb24nXSxcbiAgICBbJ2FwcicsICdhcHBsaWNhdGlvbi92bmQubG90dXMtYXBwcm9hY2gnXSxcbiAgICBbJ2FyYycsICdhcHBsaWNhdGlvbi94LWZyZWVhcmMnXSxcbiAgICBbJ2FyaicsICdhcHBsaWNhdGlvbi94LWFyaiddLFxuICAgIFsnYXNjJywgJ2FwcGxpY2F0aW9uL3BncC1zaWduYXR1cmUnXSxcbiAgICBbJ2FzZicsICd2aWRlby94LW1zLWFzZiddLFxuICAgIFsnYXNtJywgJ3RleHQveC1hc20nXSxcbiAgICBbJ2FzbycsICdhcHBsaWNhdGlvbi92bmQuYWNjcGFjLnNpbXBseS5hc28nXSxcbiAgICBbJ2FzeCcsICd2aWRlby94LW1zLWFzZiddLFxuICAgIFsnYXRjJywgJ2FwcGxpY2F0aW9uL3ZuZC5hY3Vjb3JwJ10sXG4gICAgWydhdG9tJywgJ2FwcGxpY2F0aW9uL2F0b20reG1sJ10sXG4gICAgWydhdG9tY2F0JywgJ2FwcGxpY2F0aW9uL2F0b21jYXQreG1sJ10sXG4gICAgWydhdG9tZGVsZXRlZCcsICdhcHBsaWNhdGlvbi9hdG9tZGVsZXRlZCt4bWwnXSxcbiAgICBbJ2F0b21zdmMnLCAnYXBwbGljYXRpb24vYXRvbXN2Yyt4bWwnXSxcbiAgICBbJ2F0eCcsICdhcHBsaWNhdGlvbi92bmQuYW50aXguZ2FtZS1jb21wb25lbnQnXSxcbiAgICBbJ2F1JywgJ2F1ZGlvL3gtYXUnXSxcbiAgICBbJ2F2aScsICd2aWRlby94LW1zdmlkZW8nXSxcbiAgICBbJ2F2aWYnLCAnaW1hZ2UvYXZpZiddLFxuICAgIFsnYXcnLCAnYXBwbGljYXRpb24vYXBwbGl4d2FyZSddLFxuICAgIFsnYXpmJywgJ2FwcGxpY2F0aW9uL3ZuZC5haXJ6aXAuZmlsZXNlY3VyZS5hemYnXSxcbiAgICBbJ2F6cycsICdhcHBsaWNhdGlvbi92bmQuYWlyemlwLmZpbGVzZWN1cmUuYXpzJ10sXG4gICAgWydhenYnLCAnaW1hZ2Uvdm5kLmFpcnppcC5hY2NlbGVyYXRvci5henYnXSxcbiAgICBbJ2F6dycsICdhcHBsaWNhdGlvbi92bmQuYW1hem9uLmVib29rJ10sXG4gICAgWydiMTYnLCAnaW1hZ2Uvdm5kLnBjby5iMTYnXSxcbiAgICBbJ2JhdCcsICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnXSxcbiAgICBbJ2JjcGlvJywgJ2FwcGxpY2F0aW9uL3gtYmNwaW8nXSxcbiAgICBbJ2JkZicsICdhcHBsaWNhdGlvbi94LWZvbnQtYmRmJ10sXG4gICAgWydiZG0nLCAnYXBwbGljYXRpb24vdm5kLnN5bmNtbC5kbSt3YnhtbCddLFxuICAgIFsnYmRvYycsICdhcHBsaWNhdGlvbi94LWJkb2MnXSxcbiAgICBbJ2JlZCcsICdhcHBsaWNhdGlvbi92bmQucmVhbHZuYy5iZWQnXSxcbiAgICBbJ2JoMicsICdhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c3BycyddLFxuICAgIFsnYmluJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnYmxiJywgJ2FwcGxpY2F0aW9uL3gtYmxvcmInXSxcbiAgICBbJ2Jsb3JiJywgJ2FwcGxpY2F0aW9uL3gtYmxvcmInXSxcbiAgICBbJ2JtaScsICdhcHBsaWNhdGlvbi92bmQuYm1pJ10sXG4gICAgWydibW1sJywgJ2FwcGxpY2F0aW9uL3ZuZC5iYWxzYW1pcS5ibW1sK3htbCddLFxuICAgIFsnYm1wJywgJ2ltYWdlL2JtcCddLFxuICAgIFsnYm9vaycsICdhcHBsaWNhdGlvbi92bmQuZnJhbWVtYWtlciddLFxuICAgIFsnYm94JywgJ2FwcGxpY2F0aW9uL3ZuZC5wcmV2aWV3c3lzdGVtcy5ib3gnXSxcbiAgICBbJ2JveicsICdhcHBsaWNhdGlvbi94LWJ6aXAyJ10sXG4gICAgWydicGsnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydicG1uJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnYnNwJywgJ21vZGVsL3ZuZC52YWx2ZS5zb3VyY2UuY29tcGlsZWQtbWFwJ10sXG4gICAgWydidGlmJywgJ2ltYWdlL3Bycy5idGlmJ10sXG4gICAgWydidWZmZXInLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydieicsICdhcHBsaWNhdGlvbi94LWJ6aXAnXSxcbiAgICBbJ2J6MicsICdhcHBsaWNhdGlvbi94LWJ6aXAyJ10sXG4gICAgWydjJywgJ3RleHQveC1jJ10sXG4gICAgWydjNGQnLCAnYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXAnXSxcbiAgICBbJ2M0ZicsICdhcHBsaWNhdGlvbi92bmQuY2xvbmsuYzRncm91cCddLFxuICAgIFsnYzRnJywgJ2FwcGxpY2F0aW9uL3ZuZC5jbG9uay5jNGdyb3VwJ10sXG4gICAgWydjNHAnLCAnYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXAnXSxcbiAgICBbJ2M0dScsICdhcHBsaWNhdGlvbi92bmQuY2xvbmsuYzRncm91cCddLFxuICAgIFsnYzExYW1jJywgJ2FwcGxpY2F0aW9uL3ZuZC5jbHVldHJ1c3QuY2FydG9tb2JpbGUtY29uZmlnJ10sXG4gICAgWydjMTFhbXonLCAnYXBwbGljYXRpb24vdm5kLmNsdWV0cnVzdC5jYXJ0b21vYmlsZS1jb25maWctcGtnJ10sXG4gICAgWydjYWInLCAnYXBwbGljYXRpb24vdm5kLm1zLWNhYi1jb21wcmVzc2VkJ10sXG4gICAgWydjYWYnLCAnYXVkaW8veC1jYWYnXSxcbiAgICBbJ2NhcCcsICdhcHBsaWNhdGlvbi92bmQudGNwZHVtcC5wY2FwJ10sXG4gICAgWydjYXInLCAnYXBwbGljYXRpb24vdm5kLmN1cmwuY2FyJ10sXG4gICAgWydjYXQnLCAnYXBwbGljYXRpb24vdm5kLm1zLXBraS5zZWNjYXQnXSxcbiAgICBbJ2NiNycsICdhcHBsaWNhdGlvbi94LWNiciddLFxuICAgIFsnY2JhJywgJ2FwcGxpY2F0aW9uL3gtY2JyJ10sXG4gICAgWydjYnInLCAnYXBwbGljYXRpb24veC1jYnInXSxcbiAgICBbJ2NidCcsICdhcHBsaWNhdGlvbi94LWNiciddLFxuICAgIFsnY2J6JywgJ2FwcGxpY2F0aW9uL3gtY2JyJ10sXG4gICAgWydjYycsICd0ZXh0L3gtYyddLFxuICAgIFsnY2NvJywgJ2FwcGxpY2F0aW9uL3gtY29jb2EnXSxcbiAgICBbJ2NjdCcsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydjY3htbCcsICdhcHBsaWNhdGlvbi9jY3htbCt4bWwnXSxcbiAgICBbJ2NkYmNtc2cnLCAnYXBwbGljYXRpb24vdm5kLmNvbnRhY3QuY21zZyddLFxuICAgIFsnY2RhJywgJ2FwcGxpY2F0aW9uL3gtY2RmJ10sXG4gICAgWydjZGYnLCAnYXBwbGljYXRpb24veC1uZXRjZGYnXSxcbiAgICBbJ2NkZngnLCAnYXBwbGljYXRpb24vY2RmeCt4bWwnXSxcbiAgICBbJ2Nka2V5JywgJ2FwcGxpY2F0aW9uL3ZuZC5tZWRpYXN0YXRpb24uY2RrZXknXSxcbiAgICBbJ2NkbWlhJywgJ2FwcGxpY2F0aW9uL2NkbWktY2FwYWJpbGl0eSddLFxuICAgIFsnY2RtaWMnLCAnYXBwbGljYXRpb24vY2RtaS1jb250YWluZXInXSxcbiAgICBbJ2NkbWlkJywgJ2FwcGxpY2F0aW9uL2NkbWktZG9tYWluJ10sXG4gICAgWydjZG1pbycsICdhcHBsaWNhdGlvbi9jZG1pLW9iamVjdCddLFxuICAgIFsnY2RtaXEnLCAnYXBwbGljYXRpb24vY2RtaS1xdWV1ZSddLFxuICAgIFsnY2RyJywgJ2FwcGxpY2F0aW9uL2NkciddLFxuICAgIFsnY2R4JywgJ2NoZW1pY2FsL3gtY2R4J10sXG4gICAgWydjZHhtbCcsICdhcHBsaWNhdGlvbi92bmQuY2hlbWRyYXcreG1sJ10sXG4gICAgWydjZHknLCAnYXBwbGljYXRpb24vdm5kLmNpbmRlcmVsbGEnXSxcbiAgICBbJ2NlcicsICdhcHBsaWNhdGlvbi9wa2l4LWNlcnQnXSxcbiAgICBbJ2NmcycsICdhcHBsaWNhdGlvbi94LWNmcy1jb21wcmVzc2VkJ10sXG4gICAgWydjZ20nLCAnaW1hZ2UvY2dtJ10sXG4gICAgWydjaGF0JywgJ2FwcGxpY2F0aW9uL3gtY2hhdCddLFxuICAgIFsnY2htJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1odG1saGVscCddLFxuICAgIFsnY2hydCcsICdhcHBsaWNhdGlvbi92bmQua2RlLmtjaGFydCddLFxuICAgIFsnY2lmJywgJ2NoZW1pY2FsL3gtY2lmJ10sXG4gICAgWydjaWknLCAnYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1jZXJ0aWZpY2F0ZS1pc3N1ZS1pbml0aWF0aW9uJ10sXG4gICAgWydjaWwnLCAnYXBwbGljYXRpb24vdm5kLm1zLWFydGdhbHJ5J10sXG4gICAgWydjanMnLCAnYXBwbGljYXRpb24vbm9kZSddLFxuICAgIFsnY2xhJywgJ2FwcGxpY2F0aW9uL3ZuZC5jbGF5bW9yZSddLFxuICAgIFsnY2xhc3MnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydjbGtrJywgJ2FwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLmtleWJvYXJkJ10sXG4gICAgWydjbGtwJywgJ2FwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLnBhbGV0dGUnXSxcbiAgICBbJ2Nsa3QnLCAnYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIudGVtcGxhdGUnXSxcbiAgICBbJ2Nsa3cnLCAnYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIud29yZGJhbmsnXSxcbiAgICBbJ2Nsa3gnLCAnYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXInXSxcbiAgICBbJ2NscCcsICdhcHBsaWNhdGlvbi94LW1zY2xpcCddLFxuICAgIFsnY21jJywgJ2FwcGxpY2F0aW9uL3ZuZC5jb3Ntb2NhbGxlciddLFxuICAgIFsnY21kZicsICdjaGVtaWNhbC94LWNtZGYnXSxcbiAgICBbJ2NtbCcsICdjaGVtaWNhbC94LWNtbCddLFxuICAgIFsnY21wJywgJ2FwcGxpY2F0aW9uL3ZuZC55ZWxsb3dyaXZlci1jdXN0b20tbWVudSddLFxuICAgIFsnY214JywgJ2ltYWdlL3gtY214J10sXG4gICAgWydjb2QnLCAnYXBwbGljYXRpb24vdm5kLnJpbS5jb2QnXSxcbiAgICBbJ2NvZmZlZScsICd0ZXh0L2NvZmZlZXNjcmlwdCddLFxuICAgIFsnY29tJywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCddLFxuICAgIFsnY29uZicsICd0ZXh0L3BsYWluJ10sXG4gICAgWydjcGlvJywgJ2FwcGxpY2F0aW9uL3gtY3BpbyddLFxuICAgIFsnY3BwJywgJ3RleHQveC1jJ10sXG4gICAgWydjcHQnLCAnYXBwbGljYXRpb24vbWFjLWNvbXBhY3Rwcm8nXSxcbiAgICBbJ2NyZCcsICdhcHBsaWNhdGlvbi94LW1zY2FyZGZpbGUnXSxcbiAgICBbJ2NybCcsICdhcHBsaWNhdGlvbi9wa2l4LWNybCddLFxuICAgIFsnY3J0JywgJ2FwcGxpY2F0aW9uL3gteDUwOS1jYS1jZXJ0J10sXG4gICAgWydjcngnLCAnYXBwbGljYXRpb24veC1jaHJvbWUtZXh0ZW5zaW9uJ10sXG4gICAgWydjcnlwdG9ub3RlJywgJ2FwcGxpY2F0aW9uL3ZuZC5yaWcuY3J5cHRvbm90ZSddLFxuICAgIFsnY3NoJywgJ2FwcGxpY2F0aW9uL3gtY3NoJ10sXG4gICAgWydjc2wnLCAnYXBwbGljYXRpb24vdm5kLmNpdGF0aW9uc3R5bGVzLnN0eWxlK3htbCddLFxuICAgIFsnY3NtbCcsICdjaGVtaWNhbC94LWNzbWwnXSxcbiAgICBbJ2NzcCcsICdhcHBsaWNhdGlvbi92bmQuY29tbW9uc3BhY2UnXSxcbiAgICBbJ2NzcicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2NzcycsICd0ZXh0L2NzcyddLFxuICAgIFsnY3N0JywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2NzdicsICd0ZXh0L2NzdiddLFxuICAgIFsnY3UnLCAnYXBwbGljYXRpb24vY3Utc2VlbWUnXSxcbiAgICBbJ2N1cmwnLCAndGV4dC92bmQuY3VybCddLFxuICAgIFsnY3d3JywgJ2FwcGxpY2F0aW9uL3Bycy5jd3cnXSxcbiAgICBbJ2N4dCcsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydjeHgnLCAndGV4dC94LWMnXSxcbiAgICBbJ2RhZScsICdtb2RlbC92bmQuY29sbGFkYSt4bWwnXSxcbiAgICBbJ2RhZicsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLmRhZiddLFxuICAgIFsnZGFydCcsICdhcHBsaWNhdGlvbi92bmQuZGFydCddLFxuICAgIFsnZGF0YWxlc3MnLCAnYXBwbGljYXRpb24vdm5kLmZkc24uc2VlZCddLFxuICAgIFsnZGF2bW91bnQnLCAnYXBwbGljYXRpb24vZGF2bW91bnQreG1sJ10sXG4gICAgWydkYmYnLCAnYXBwbGljYXRpb24vdm5kLmRiZiddLFxuICAgIFsnZGJrJywgJ2FwcGxpY2F0aW9uL2RvY2Jvb2sreG1sJ10sXG4gICAgWydkY3InLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnZGN1cmwnLCAndGV4dC92bmQuY3VybC5kY3VybCddLFxuICAgIFsnZGQyJywgJ2FwcGxpY2F0aW9uL3ZuZC5vbWEuZGQyK3htbCddLFxuICAgIFsnZGRkJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZGRkJ10sXG4gICAgWydkZGYnLCAnYXBwbGljYXRpb24vdm5kLnN5bmNtbC5kbWRkZit4bWwnXSxcbiAgICBbJ2RkcycsICdpbWFnZS92bmQubXMtZGRzJ10sXG4gICAgWydkZWInLCAnYXBwbGljYXRpb24veC1kZWJpYW4tcGFja2FnZSddLFxuICAgIFsnZGVmJywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ2RlcGxveScsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2RlcicsICdhcHBsaWNhdGlvbi94LXg1MDktY2EtY2VydCddLFxuICAgIFsnZGZhYycsICdhcHBsaWNhdGlvbi92bmQuZHJlYW1mYWN0b3J5J10sXG4gICAgWydkZ2MnLCAnYXBwbGljYXRpb24veC1kZ2MtY29tcHJlc3NlZCddLFxuICAgIFsnZGljJywgJ3RleHQveC1jJ10sXG4gICAgWydkaXInLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnZGlzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMuZGlzJ10sXG4gICAgWydkaXNwb3NpdGlvbi1ub3RpZmljYXRpb24nLCAnbWVzc2FnZS9kaXNwb3NpdGlvbi1ub3RpZmljYXRpb24nXSxcbiAgICBbJ2Rpc3QnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkaXN0eicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2RqdicsICdpbWFnZS92bmQuZGp2dSddLFxuICAgIFsnZGp2dScsICdpbWFnZS92bmQuZGp2dSddLFxuICAgIFsnZGxsJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZG1nJywgJ2FwcGxpY2F0aW9uL3gtYXBwbGUtZGlza2ltYWdlJ10sXG4gICAgWydkbW4nLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkbXAnLCAnYXBwbGljYXRpb24vdm5kLnRjcGR1bXAucGNhcCddLFxuICAgIFsnZG1zJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZG5hJywgJ2FwcGxpY2F0aW9uL3ZuZC5kbmEnXSxcbiAgICBbJ2RvYycsICdhcHBsaWNhdGlvbi9tc3dvcmQnXSxcbiAgICBbJ2RvY20nLCAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmQudGVtcGxhdGUubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWydkb2N4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50J10sXG4gICAgWydkb3QnLCAnYXBwbGljYXRpb24vbXN3b3JkJ10sXG4gICAgWydkb3RtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsnZG90eCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZSddLFxuICAgIFsnZHAnLCAnYXBwbGljYXRpb24vdm5kLm9zZ2kuZHAnXSxcbiAgICBbJ2RwZycsICdhcHBsaWNhdGlvbi92bmQuZHBncmFwaCddLFxuICAgIFsnZHJhJywgJ2F1ZGlvL3ZuZC5kcmEnXSxcbiAgICBbJ2RybGUnLCAnaW1hZ2UvZGljb20tcmxlJ10sXG4gICAgWydkc2MnLCAndGV4dC9wcnMubGluZXMudGFnJ10sXG4gICAgWydkc3NjJywgJ2FwcGxpY2F0aW9uL2Rzc2MrZGVyJ10sXG4gICAgWydkdGInLCAnYXBwbGljYXRpb24veC1kdGJvb2sreG1sJ10sXG4gICAgWydkdGQnLCAnYXBwbGljYXRpb24veG1sLWR0ZCddLFxuICAgIFsnZHRzJywgJ2F1ZGlvL3ZuZC5kdHMnXSxcbiAgICBbJ2R0c2hkJywgJ2F1ZGlvL3ZuZC5kdHMuaGQnXSxcbiAgICBbJ2R1bXAnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkdmInLCAndmlkZW8vdm5kLmR2Yi5maWxlJ10sXG4gICAgWydkdmknLCAnYXBwbGljYXRpb24veC1kdmknXSxcbiAgICBbJ2R3ZCcsICdhcHBsaWNhdGlvbi9hdHNjLWR3ZCt4bWwnXSxcbiAgICBbJ2R3ZicsICdtb2RlbC92bmQuZHdmJ10sXG4gICAgWydkd2cnLCAnaW1hZ2Uvdm5kLmR3ZyddLFxuICAgIFsnZHhmJywgJ2ltYWdlL3ZuZC5keGYnXSxcbiAgICBbJ2R4cCcsICdhcHBsaWNhdGlvbi92bmQuc3BvdGZpcmUuZHhwJ10sXG4gICAgWydkeHInLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnZWFyJywgJ2FwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZSddLFxuICAgIFsnZWNlbHA0ODAwJywgJ2F1ZGlvL3ZuZC5udWVyYS5lY2VscDQ4MDAnXSxcbiAgICBbJ2VjZWxwNzQ3MCcsICdhdWRpby92bmQubnVlcmEuZWNlbHA3NDcwJ10sXG4gICAgWydlY2VscDk2MDAnLCAnYXVkaW8vdm5kLm51ZXJhLmVjZWxwOTYwMCddLFxuICAgIFsnZWNtYScsICdhcHBsaWNhdGlvbi9lY21hc2NyaXB0J10sXG4gICAgWydlZG0nLCAnYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmVkbSddLFxuICAgIFsnZWR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5lZHgnXSxcbiAgICBbJ2VmaWYnLCAnYXBwbGljYXRpb24vdm5kLnBpY3NlbCddLFxuICAgIFsnZWk2JywgJ2FwcGxpY2F0aW9uL3ZuZC5wZy5vc2FzbGknXSxcbiAgICBbJ2VsYycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2VtZicsICdpbWFnZS9lbWYnXSxcbiAgICBbJ2VtbCcsICdtZXNzYWdlL3JmYzgyMiddLFxuICAgIFsnZW1tYScsICdhcHBsaWNhdGlvbi9lbW1hK3htbCddLFxuICAgIFsnZW1vdGlvbm1sJywgJ2FwcGxpY2F0aW9uL2Vtb3Rpb25tbCt4bWwnXSxcbiAgICBbJ2VteicsICdhcHBsaWNhdGlvbi94LW1zbWV0YWZpbGUnXSxcbiAgICBbJ2VvbCcsICdhdWRpby92bmQuZGlnaXRhbC13aW5kcyddLFxuICAgIFsnZW90JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0J10sXG4gICAgWydlcHMnLCAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCddLFxuICAgIFsnZXB1YicsICdhcHBsaWNhdGlvbi9lcHViK3ppcCddLFxuICAgIFsnZXMnLCAnYXBwbGljYXRpb24vZWNtYXNjcmlwdCddLFxuICAgIFsnZXMzJywgJ2FwcGxpY2F0aW9uL3ZuZC5lc3ppZ25vMyt4bWwnXSxcbiAgICBbJ2VzYScsICdhcHBsaWNhdGlvbi92bmQub3NnaS5zdWJzeXN0ZW0nXSxcbiAgICBbJ2VzZicsICdhcHBsaWNhdGlvbi92bmQuZXBzb24uZXNmJ10sXG4gICAgWydldDMnLCAnYXBwbGljYXRpb24vdm5kLmVzemlnbm8zK3htbCddLFxuICAgIFsnZXR4JywgJ3RleHQveC1zZXRleHQnXSxcbiAgICBbJ2V2YScsICdhcHBsaWNhdGlvbi94LWV2YSddLFxuICAgIFsnZXZ5JywgJ2FwcGxpY2F0aW9uL3gtZW52b3knXSxcbiAgICBbJ2V4ZScsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2V4aScsICdhcHBsaWNhdGlvbi9leGknXSxcbiAgICBbJ2V4cCcsICdhcHBsaWNhdGlvbi9leHByZXNzJ10sXG4gICAgWydleHInLCAnaW1hZ2UvYWNlcyddLFxuICAgIFsnZXh0JywgJ2FwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5leHQnXSxcbiAgICBbJ2V6JywgJ2FwcGxpY2F0aW9uL2FuZHJldy1pbnNldCddLFxuICAgIFsnZXoyJywgJ2FwcGxpY2F0aW9uL3ZuZC5lenBpeC1hbGJ1bSddLFxuICAgIFsnZXozJywgJ2FwcGxpY2F0aW9uL3ZuZC5lenBpeC1wYWNrYWdlJ10sXG4gICAgWydmJywgJ3RleHQveC1mb3J0cmFuJ10sXG4gICAgWydmNHYnLCAndmlkZW8vbXA0J10sXG4gICAgWydmNzcnLCAndGV4dC94LWZvcnRyYW4nXSxcbiAgICBbJ2Y5MCcsICd0ZXh0L3gtZm9ydHJhbiddLFxuICAgIFsnZmJzJywgJ2ltYWdlL3ZuZC5mYXN0Ymlkc2hlZXQnXSxcbiAgICBbJ2ZjZHQnLCAnYXBwbGljYXRpb24vdm5kLmFkb2JlLmZvcm1zY2VudHJhbC5mY2R0J10sXG4gICAgWydmY3MnLCAnYXBwbGljYXRpb24vdm5kLmlzYWMuZmNzJ10sXG4gICAgWydmZGYnLCAnYXBwbGljYXRpb24vdm5kLmZkZiddLFxuICAgIFsnZmR0JywgJ2FwcGxpY2F0aW9uL2ZkdCt4bWwnXSxcbiAgICBbJ2ZlX2xhdW5jaCcsICdhcHBsaWNhdGlvbi92bmQuZGVub3ZvLmZjc2VsYXlvdXQtbGluayddLFxuICAgIFsnZmc1JywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzZ3AnXSxcbiAgICBbJ2ZnZCcsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydmaCcsICdpbWFnZS94LWZyZWVoYW5kJ10sXG4gICAgWydmaDQnLCAnaW1hZ2UveC1mcmVlaGFuZCddLFxuICAgIFsnZmg1JywgJ2ltYWdlL3gtZnJlZWhhbmQnXSxcbiAgICBbJ2ZoNycsICdpbWFnZS94LWZyZWVoYW5kJ10sXG4gICAgWydmaGMnLCAnaW1hZ2UveC1mcmVlaGFuZCddLFxuICAgIFsnZmlnJywgJ2FwcGxpY2F0aW9uL3gteGZpZyddLFxuICAgIFsnZml0cycsICdpbWFnZS9maXRzJ10sXG4gICAgWydmbGFjJywgJ2F1ZGlvL3gtZmxhYyddLFxuICAgIFsnZmxpJywgJ3ZpZGVvL3gtZmxpJ10sXG4gICAgWydmbG8nLCAnYXBwbGljYXRpb24vdm5kLm1pY3JvZ3JhZnguZmxvJ10sXG4gICAgWydmbHYnLCAndmlkZW8veC1mbHYnXSxcbiAgICBbJ2ZsdycsICdhcHBsaWNhdGlvbi92bmQua2RlLmtpdmlvJ10sXG4gICAgWydmbHgnLCAndGV4dC92bmQuZm1pLmZsZXhzdG9yJ10sXG4gICAgWydmbHknLCAndGV4dC92bmQuZmx5J10sXG4gICAgWydmbScsICdhcHBsaWNhdGlvbi92bmQuZnJhbWVtYWtlciddLFxuICAgIFsnZm5jJywgJ2FwcGxpY2F0aW9uL3ZuZC5mcm9nYW5zLmZuYyddLFxuICAgIFsnZm8nLCAnYXBwbGljYXRpb24vdm5kLnNvZnR3YXJlNjAyLmZpbGxlci5mb3JtK3htbCddLFxuICAgIFsnZm9yJywgJ3RleHQveC1mb3J0cmFuJ10sXG4gICAgWydmcHgnLCAnaW1hZ2Uvdm5kLmZweCddLFxuICAgIFsnZnJhbWUnLCAnYXBwbGljYXRpb24vdm5kLmZyYW1lbWFrZXInXSxcbiAgICBbJ2ZzYycsICdhcHBsaWNhdGlvbi92bmQuZnNjLndlYmxhdW5jaCddLFxuICAgIFsnZnN0JywgJ2ltYWdlL3ZuZC5mc3QnXSxcbiAgICBbJ2Z0YycsICdhcHBsaWNhdGlvbi92bmQuZmx1eHRpbWUuY2xpcCddLFxuICAgIFsnZnRpJywgJ2FwcGxpY2F0aW9uL3ZuZC5hbnNlci13ZWItZnVuZHMtdHJhbnNmZXItaW5pdGlhdGlvbiddLFxuICAgIFsnZnZ0JywgJ3ZpZGVvL3ZuZC5mdnQnXSxcbiAgICBbJ2Z4cCcsICdhcHBsaWNhdGlvbi92bmQuYWRvYmUuZnhwJ10sXG4gICAgWydmeHBsJywgJ2FwcGxpY2F0aW9uL3ZuZC5hZG9iZS5meHAnXSxcbiAgICBbJ2Z6cycsICdhcHBsaWNhdGlvbi92bmQuZnV6enlzaGVldCddLFxuICAgIFsnZzJ3JywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9wbGFuJ10sXG4gICAgWydnMycsICdpbWFnZS9nM2ZheCddLFxuICAgIFsnZzN3JywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9zcGFjZSddLFxuICAgIFsnZ2FjJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtYWNjb3VudCddLFxuICAgIFsnZ2FtJywgJ2FwcGxpY2F0aW9uL3gtdGFkcyddLFxuICAgIFsnZ2JyJywgJ2FwcGxpY2F0aW9uL3Jwa2ktZ2hvc3RidXN0ZXJzJ10sXG4gICAgWydnY2EnLCAnYXBwbGljYXRpb24veC1nY2EtY29tcHJlc3NlZCddLFxuICAgIFsnZ2RsJywgJ21vZGVsL3ZuZC5nZGwnXSxcbiAgICBbJ2dkb2MnLCAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLmRvY3VtZW50J10sXG4gICAgWydnZW8nLCAnYXBwbGljYXRpb24vdm5kLmR5bmFnZW8nXSxcbiAgICBbJ2dlb2pzb24nLCAnYXBwbGljYXRpb24vZ2VvK2pzb24nXSxcbiAgICBbJ2dleCcsICdhcHBsaWNhdGlvbi92bmQuZ2VvbWV0cnktZXhwbG9yZXInXSxcbiAgICBbJ2dnYicsICdhcHBsaWNhdGlvbi92bmQuZ2VvZ2VicmEuZmlsZSddLFxuICAgIFsnZ2d0JywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9nZWJyYS50b29sJ10sXG4gICAgWydnaGYnLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS1oZWxwJ10sXG4gICAgWydnaWYnLCAnaW1hZ2UvZ2lmJ10sXG4gICAgWydnaW0nLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS1pZGVudGl0eS1tZXNzYWdlJ10sXG4gICAgWydnbGInLCAnbW9kZWwvZ2x0Zi1iaW5hcnknXSxcbiAgICBbJ2dsdGYnLCAnbW9kZWwvZ2x0Zitqc29uJ10sXG4gICAgWydnbWwnLCAnYXBwbGljYXRpb24vZ21sK3htbCddLFxuICAgIFsnZ214JywgJ2FwcGxpY2F0aW9uL3ZuZC5nbXgnXSxcbiAgICBbJ2dudW1lcmljJywgJ2FwcGxpY2F0aW9uL3gtZ251bWVyaWMnXSxcbiAgICBbJ2dwZycsICdhcHBsaWNhdGlvbi9ncGcta2V5cyddLFxuICAgIFsnZ3BoJywgJ2FwcGxpY2F0aW9uL3ZuZC5mbG9ncmFwaGl0J10sXG4gICAgWydncHgnLCAnYXBwbGljYXRpb24vZ3B4K3htbCddLFxuICAgIFsnZ3FmJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncmFmZXEnXSxcbiAgICBbJ2dxcycsICdhcHBsaWNhdGlvbi92bmQuZ3JhZmVxJ10sXG4gICAgWydncmFtJywgJ2FwcGxpY2F0aW9uL3NyZ3MnXSxcbiAgICBbJ2dyYW1wcycsICdhcHBsaWNhdGlvbi94LWdyYW1wcy14bWwnXSxcbiAgICBbJ2dyZScsICdhcHBsaWNhdGlvbi92bmQuZ2VvbWV0cnktZXhwbG9yZXInXSxcbiAgICBbJ2dydicsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWluamVjdG9yJ10sXG4gICAgWydncnhtbCcsICdhcHBsaWNhdGlvbi9zcmdzK3htbCddLFxuICAgIFsnZ3NmJywgJ2FwcGxpY2F0aW9uL3gtZm9udC1naG9zdHNjcmlwdCddLFxuICAgIFsnZ3NoZWV0JywgJ2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtYXBwcy5zcHJlYWRzaGVldCddLFxuICAgIFsnZ3NsaWRlcycsICdhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMucHJlc2VudGF0aW9uJ10sXG4gICAgWydndGFyJywgJ2FwcGxpY2F0aW9uL3gtZ3RhciddLFxuICAgIFsnZ3RtJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdG9vbC1tZXNzYWdlJ10sXG4gICAgWydndHcnLCAnbW9kZWwvdm5kLmd0dyddLFxuICAgIFsnZ3YnLCAndGV4dC92bmQuZ3JhcGh2aXonXSxcbiAgICBbJ2d4ZicsICdhcHBsaWNhdGlvbi9neGYnXSxcbiAgICBbJ2d4dCcsICdhcHBsaWNhdGlvbi92bmQuZ2VvbmV4dCddLFxuICAgIFsnZ3onLCAnYXBwbGljYXRpb24vZ3ppcCddLFxuICAgIFsnZ3ppcCcsICdhcHBsaWNhdGlvbi9nemlwJ10sXG4gICAgWydoJywgJ3RleHQveC1jJ10sXG4gICAgWydoMjYxJywgJ3ZpZGVvL2gyNjEnXSxcbiAgICBbJ2gyNjMnLCAndmlkZW8vaDI2MyddLFxuICAgIFsnaDI2NCcsICd2aWRlby9oMjY0J10sXG4gICAgWydoYWwnLCAnYXBwbGljYXRpb24vdm5kLmhhbCt4bWwnXSxcbiAgICBbJ2hiY2knLCAnYXBwbGljYXRpb24vdm5kLmhiY2knXSxcbiAgICBbJ2hicycsICd0ZXh0L3gtaGFuZGxlYmFycy10ZW1wbGF0ZSddLFxuICAgIFsnaGRkJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1oZGQnXSxcbiAgICBbJ2hkZicsICdhcHBsaWNhdGlvbi94LWhkZiddLFxuICAgIFsnaGVpYycsICdpbWFnZS9oZWljJ10sXG4gICAgWydoZWljcycsICdpbWFnZS9oZWljLXNlcXVlbmNlJ10sXG4gICAgWydoZWlmJywgJ2ltYWdlL2hlaWYnXSxcbiAgICBbJ2hlaWZzJywgJ2ltYWdlL2hlaWYtc2VxdWVuY2UnXSxcbiAgICBbJ2hlajInLCAnaW1hZ2UvaGVqMmsnXSxcbiAgICBbJ2hlbGQnLCAnYXBwbGljYXRpb24vYXRzYy1oZWxkK3htbCddLFxuICAgIFsnaGgnLCAndGV4dC94LWMnXSxcbiAgICBbJ2hqc29uJywgJ2FwcGxpY2F0aW9uL2hqc29uJ10sXG4gICAgWydobHAnLCAnYXBwbGljYXRpb24vd2luaGxwJ10sXG4gICAgWydocGdsJywgJ2FwcGxpY2F0aW9uL3ZuZC5ocC1ocGdsJ10sXG4gICAgWydocGlkJywgJ2FwcGxpY2F0aW9uL3ZuZC5ocC1ocGlkJ10sXG4gICAgWydocHMnLCAnYXBwbGljYXRpb24vdm5kLmhwLWhwcyddLFxuICAgIFsnaHF4JywgJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCddLFxuICAgIFsnaHNqMicsICdpbWFnZS9oc2oyJ10sXG4gICAgWydodGMnLCAndGV4dC94LWNvbXBvbmVudCddLFxuICAgIFsnaHRrZScsICdhcHBsaWNhdGlvbi92bmQua2VuYW1lYWFwcCddLFxuICAgIFsnaHRtJywgJ3RleHQvaHRtbCddLFxuICAgIFsnaHRtbCcsICd0ZXh0L2h0bWwnXSxcbiAgICBbJ2h2ZCcsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LWRpYyddLFxuICAgIFsnaHZwJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtdm9pY2UnXSxcbiAgICBbJ2h2cycsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LXNjcmlwdCddLFxuICAgIFsnaTJnJywgJ2FwcGxpY2F0aW9uL3ZuZC5pbnRlcmdlbyddLFxuICAgIFsnaWNjJywgJ2FwcGxpY2F0aW9uL3ZuZC5pY2Nwcm9maWxlJ10sXG4gICAgWydpY2UnLCAneC1jb25mZXJlbmNlL3gtY29vbHRhbGsnXSxcbiAgICBbJ2ljbScsICdhcHBsaWNhdGlvbi92bmQuaWNjcHJvZmlsZSddLFxuICAgIFsnaWNvJywgJ2ltYWdlL3gtaWNvbiddLFxuICAgIFsnaWNzJywgJ3RleHQvY2FsZW5kYXInXSxcbiAgICBbJ2llZicsICdpbWFnZS9pZWYnXSxcbiAgICBbJ2lmYicsICd0ZXh0L2NhbGVuZGFyJ10sXG4gICAgWydpZm0nLCAnYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmZvcm1kYXRhJ10sXG4gICAgWydpZ2VzJywgJ21vZGVsL2lnZXMnXSxcbiAgICBbJ2lnbCcsICdhcHBsaWNhdGlvbi92bmQuaWdsb2FkZXInXSxcbiAgICBbJ2lnbScsICdhcHBsaWNhdGlvbi92bmQuaW5zb3JzLmlnbSddLFxuICAgIFsnaWdzJywgJ21vZGVsL2lnZXMnXSxcbiAgICBbJ2lneCcsICdhcHBsaWNhdGlvbi92bmQubWljcm9ncmFmeC5pZ3gnXSxcbiAgICBbJ2lpZicsICdhcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQuaW50ZXJjaGFuZ2UnXSxcbiAgICBbJ2ltZycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2ltcCcsICdhcHBsaWNhdGlvbi92bmQuYWNjcGFjLnNpbXBseS5pbXAnXSxcbiAgICBbJ2ltcycsICdhcHBsaWNhdGlvbi92bmQubXMtaW1zJ10sXG4gICAgWydpbicsICd0ZXh0L3BsYWluJ10sXG4gICAgWydpbmknLCAndGV4dC9wbGFpbiddLFxuICAgIFsnaW5rJywgJ2FwcGxpY2F0aW9uL2lua21sK3htbCddLFxuICAgIFsnaW5rbWwnLCAnYXBwbGljYXRpb24vaW5rbWwreG1sJ10sXG4gICAgWydpbnN0YWxsJywgJ2FwcGxpY2F0aW9uL3gtaW5zdGFsbC1pbnN0cnVjdGlvbnMnXSxcbiAgICBbJ2lvdGEnLCAnYXBwbGljYXRpb24vdm5kLmFzdHJhZWEtc29mdHdhcmUuaW90YSddLFxuICAgIFsnaXBmaXgnLCAnYXBwbGljYXRpb24vaXBmaXgnXSxcbiAgICBbJ2lwaycsICdhcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQucGFja2FnZSddLFxuICAgIFsnaXJtJywgJ2FwcGxpY2F0aW9uL3ZuZC5pYm0ucmlnaHRzLW1hbmFnZW1lbnQnXSxcbiAgICBbJ2lycCcsICdhcHBsaWNhdGlvbi92bmQuaXJlcG9zaXRvcnkucGFja2FnZSt4bWwnXSxcbiAgICBbJ2lzbycsICdhcHBsaWNhdGlvbi94LWlzbzk2NjAtaW1hZ2UnXSxcbiAgICBbJ2l0cCcsICdhcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQuZm9ybXRlbXBsYXRlJ10sXG4gICAgWydpdHMnLCAnYXBwbGljYXRpb24vaXRzK3htbCddLFxuICAgIFsnaXZwJywgJ2FwcGxpY2F0aW9uL3ZuZC5pbW1lcnZpc2lvbi1pdnAnXSxcbiAgICBbJ2l2dScsICdhcHBsaWNhdGlvbi92bmQuaW1tZXJ2aXNpb24taXZ1J10sXG4gICAgWydqYWQnLCAndGV4dC92bmQuc3VuLmoybWUuYXBwLWRlc2NyaXB0b3InXSxcbiAgICBbJ2phZGUnLCAndGV4dC9qYWRlJ10sXG4gICAgWydqYW0nLCAnYXBwbGljYXRpb24vdm5kLmphbSddLFxuICAgIFsnamFyJywgJ2FwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZSddLFxuICAgIFsnamFyZGlmZicsICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZS1kaWZmJ10sXG4gICAgWydqYXZhJywgJ3RleHQveC1qYXZhLXNvdXJjZSddLFxuICAgIFsnamhjJywgJ2ltYWdlL2pwaGMnXSxcbiAgICBbJ2ppc3AnLCAnYXBwbGljYXRpb24vdm5kLmppc3AnXSxcbiAgICBbJ2pscycsICdpbWFnZS9qbHMnXSxcbiAgICBbJ2psdCcsICdhcHBsaWNhdGlvbi92bmQuaHAtamx5dCddLFxuICAgIFsnam5nJywgJ2ltYWdlL3gtam5nJ10sXG4gICAgWydqbmxwJywgJ2FwcGxpY2F0aW9uL3gtamF2YS1qbmxwLWZpbGUnXSxcbiAgICBbJ2pvZGEnLCAnYXBwbGljYXRpb24vdm5kLmpvb3N0LmpvZGEtYXJjaGl2ZSddLFxuICAgIFsnanAyJywgJ2ltYWdlL2pwMiddLFxuICAgIFsnanBlJywgJ2ltYWdlL2pwZWcnXSxcbiAgICBbJ2pwZWcnLCAnaW1hZ2UvanBlZyddLFxuICAgIFsnanBmJywgJ2ltYWdlL2pweCddLFxuICAgIFsnanBnJywgJ2ltYWdlL2pwZWcnXSxcbiAgICBbJ2pwZzInLCAnaW1hZ2UvanAyJ10sXG4gICAgWydqcGdtJywgJ3ZpZGVvL2pwbSddLFxuICAgIFsnanBndicsICd2aWRlby9qcGVnJ10sXG4gICAgWydqcGgnLCAnaW1hZ2UvanBoJ10sXG4gICAgWydqcG0nLCAndmlkZW8vanBtJ10sXG4gICAgWydqcHgnLCAnaW1hZ2UvanB4J10sXG4gICAgWydqcycsICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0J10sXG4gICAgWydqc29uJywgJ2FwcGxpY2F0aW9uL2pzb24nXSxcbiAgICBbJ2pzb241JywgJ2FwcGxpY2F0aW9uL2pzb241J10sXG4gICAgWydqc29ubGQnLCAnYXBwbGljYXRpb24vbGQranNvbiddLFxuICAgIC8vIGh0dHBzOi8vanNvbmxpbmVzLm9yZy9cbiAgICBbJ2pzb25sJywgJ2FwcGxpY2F0aW9uL2pzb25sJ10sXG4gICAgWydqc29ubWwnLCAnYXBwbGljYXRpb24vanNvbm1sK2pzb24nXSxcbiAgICBbJ2pzeCcsICd0ZXh0L2pzeCddLFxuICAgIFsnanhyJywgJ2ltYWdlL2p4ciddLFxuICAgIFsnanhyYScsICdpbWFnZS9qeHJhJ10sXG4gICAgWydqeHJzJywgJ2ltYWdlL2p4cnMnXSxcbiAgICBbJ2p4cycsICdpbWFnZS9qeHMnXSxcbiAgICBbJ2p4c2MnLCAnaW1hZ2UvanhzYyddLFxuICAgIFsnanhzaScsICdpbWFnZS9qeHNpJ10sXG4gICAgWydqeHNzJywgJ2ltYWdlL2p4c3MnXSxcbiAgICBbJ2thcicsICdhdWRpby9taWRpJ10sXG4gICAgWydrYXJib24nLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rYXJib24nXSxcbiAgICBbJ2tkYicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2tkYngnLCAnYXBwbGljYXRpb24veC1rZWVwYXNzMiddLFxuICAgIFsna2V5JywgJ2FwcGxpY2F0aW9uL3gtaXdvcmsta2V5bm90ZS1zZmZrZXknXSxcbiAgICBbJ2tmbycsICdhcHBsaWNhdGlvbi92bmQua2RlLmtmb3JtdWxhJ10sXG4gICAgWydraWEnLCAnYXBwbGljYXRpb24vdm5kLmtpZHNwaXJhdGlvbiddLFxuICAgIFsna21sJywgJ2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtZWFydGgua21sK3htbCddLFxuICAgIFsna216JywgJ2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtZWFydGgua216J10sXG4gICAgWydrbmUnLCAnYXBwbGljYXRpb24vdm5kLmtpbmFyJ10sXG4gICAgWydrbnAnLCAnYXBwbGljYXRpb24vdm5kLmtpbmFyJ10sXG4gICAgWydrb24nLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rb250b3VyJ10sXG4gICAgWydrcHInLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rcHJlc2VudGVyJ10sXG4gICAgWydrcHQnLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rcHJlc2VudGVyJ10sXG4gICAgWydrcHh4JywgJ2FwcGxpY2F0aW9uL3ZuZC5kcy1rZXlwb2ludCddLFxuICAgIFsna3NwJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua3NwcmVhZCddLFxuICAgIFsna3RyJywgJ2FwcGxpY2F0aW9uL3ZuZC5rYWhvb3R6J10sXG4gICAgWydrdHgnLCAnaW1hZ2Uva3R4J10sXG4gICAgWydrdHgyJywgJ2ltYWdlL2t0eDInXSxcbiAgICBbJ2t0eicsICdhcHBsaWNhdGlvbi92bmQua2Fob290eiddLFxuICAgIFsna3dkJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua3dvcmQnXSxcbiAgICBbJ2t3dCcsICdhcHBsaWNhdGlvbi92bmQua2RlLmt3b3JkJ10sXG4gICAgWydsYXN4bWwnLCAnYXBwbGljYXRpb24vdm5kLmxhcy5sYXMreG1sJ10sXG4gICAgWydsYXRleCcsICdhcHBsaWNhdGlvbi94LWxhdGV4J10sXG4gICAgWydsYmQnLCAnYXBwbGljYXRpb24vdm5kLmxsYW1hZ3JhcGhpY3MubGlmZS1iYWxhbmNlLmRlc2t0b3AnXSxcbiAgICBbJ2xiZScsICdhcHBsaWNhdGlvbi92bmQubGxhbWFncmFwaGljcy5saWZlLWJhbGFuY2UuZXhjaGFuZ2UreG1sJ10sXG4gICAgWydsZXMnLCAnYXBwbGljYXRpb24vdm5kLmhoZS5sZXNzb24tcGxheWVyJ10sXG4gICAgWydsZXNzJywgJ3RleHQvbGVzcyddLFxuICAgIFsnbGdyJywgJ2FwcGxpY2F0aW9uL2xncit4bWwnXSxcbiAgICBbJ2xoYScsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2xpbms2NicsICdhcHBsaWNhdGlvbi92bmQucm91dGU2Ni5saW5rNjYreG1sJ10sXG4gICAgWydsaXN0JywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ2xpc3QzODIwJywgJ2FwcGxpY2F0aW9uL3ZuZC5pYm0ubW9kY2FwJ10sXG4gICAgWydsaXN0YWZwJywgJ2FwcGxpY2F0aW9uL3ZuZC5pYm0ubW9kY2FwJ10sXG4gICAgWydsaXRjb2ZmZWUnLCAndGV4dC9jb2ZmZWVzY3JpcHQnXSxcbiAgICBbJ2xuaycsICdhcHBsaWNhdGlvbi94LW1zLXNob3J0Y3V0J10sXG4gICAgWydsb2cnLCAndGV4dC9wbGFpbiddLFxuICAgIFsnbG9zdHhtbCcsICdhcHBsaWNhdGlvbi9sb3N0K3htbCddLFxuICAgIFsnbHJmJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnbHJtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1scm0nXSxcbiAgICBbJ2x0ZicsICdhcHBsaWNhdGlvbi92bmQuZnJvZ2Fucy5sdGYnXSxcbiAgICBbJ2x1YScsICd0ZXh0L3gtbHVhJ10sXG4gICAgWydsdWFjJywgJ2FwcGxpY2F0aW9uL3gtbHVhLWJ5dGVjb2RlJ10sXG4gICAgWydsdnAnLCAnYXVkaW8vdm5kLmx1Y2VudC52b2ljZSddLFxuICAgIFsnbHdwJywgJ2FwcGxpY2F0aW9uL3ZuZC5sb3R1cy13b3JkcHJvJ10sXG4gICAgWydsemgnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydtMXYnLCAndmlkZW8vbXBlZyddLFxuICAgIFsnbTJhJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ20ydicsICd2aWRlby9tcGVnJ10sXG4gICAgWydtM2EnLCAnYXVkaW8vbXBlZyddLFxuICAgIFsnbTN1JywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ20zdTgnLCAnYXBwbGljYXRpb24vdm5kLmFwcGxlLm1wZWd1cmwnXSxcbiAgICBbJ200YScsICdhdWRpby94LW00YSddLFxuICAgIFsnbTRwJywgJ2FwcGxpY2F0aW9uL21wNCddLFxuICAgIFsnbTRzJywgJ3ZpZGVvL2lzby5zZWdtZW50J10sXG4gICAgWydtNHUnLCAnYXBwbGljYXRpb24vdm5kLm1wZWd1cmwnXSxcbiAgICBbJ200dicsICd2aWRlby94LW00diddLFxuICAgIFsnbTEzJywgJ2FwcGxpY2F0aW9uL3gtbXNtZWRpYXZpZXcnXSxcbiAgICBbJ20xNCcsICdhcHBsaWNhdGlvbi94LW1zbWVkaWF2aWV3J10sXG4gICAgWydtMjEnLCAnYXBwbGljYXRpb24vbXAyMSddLFxuICAgIFsnbWEnLCAnYXBwbGljYXRpb24vbWF0aGVtYXRpY2EnXSxcbiAgICBbJ21hZHMnLCAnYXBwbGljYXRpb24vbWFkcyt4bWwnXSxcbiAgICBbJ21hZWknLCAnYXBwbGljYXRpb24vbW10LWFlaSt4bWwnXSxcbiAgICBbJ21hZycsICdhcHBsaWNhdGlvbi92bmQuZWNvd2luLmNoYXJ0J10sXG4gICAgWydtYWtlcicsICdhcHBsaWNhdGlvbi92bmQuZnJhbWVtYWtlciddLFxuICAgIFsnbWFuJywgJ3RleHQvdHJvZmYnXSxcbiAgICBbJ21hbmlmZXN0JywgJ3RleHQvY2FjaGUtbWFuaWZlc3QnXSxcbiAgICBbJ21hcCcsICdhcHBsaWNhdGlvbi9qc29uJ10sXG4gICAgWydtYXInLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydtYXJrZG93bicsICd0ZXh0L21hcmtkb3duJ10sXG4gICAgWydtYXRobWwnLCAnYXBwbGljYXRpb24vbWF0aG1sK3htbCddLFxuICAgIFsnbWInLCAnYXBwbGljYXRpb24vbWF0aGVtYXRpY2EnXSxcbiAgICBbJ21iaycsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLm1iayddLFxuICAgIFsnbWJveCcsICdhcHBsaWNhdGlvbi9tYm94J10sXG4gICAgWydtYzEnLCAnYXBwbGljYXRpb24vdm5kLm1lZGNhbGNkYXRhJ10sXG4gICAgWydtY2QnLCAnYXBwbGljYXRpb24vdm5kLm1jZCddLFxuICAgIFsnbWN1cmwnLCAndGV4dC92bmQuY3VybC5tY3VybCddLFxuICAgIFsnbWQnLCAndGV4dC9tYXJrZG93biddLFxuICAgIFsnbWRiJywgJ2FwcGxpY2F0aW9uL3gtbXNhY2Nlc3MnXSxcbiAgICBbJ21kaScsICdpbWFnZS92bmQubXMtbW9kaSddLFxuICAgIFsnbWR4JywgJ3RleHQvbWR4J10sXG4gICAgWydtZScsICd0ZXh0L3Ryb2ZmJ10sXG4gICAgWydtZXNoJywgJ21vZGVsL21lc2gnXSxcbiAgICBbJ21ldGE0JywgJ2FwcGxpY2F0aW9uL21ldGFsaW5rNCt4bWwnXSxcbiAgICBbJ21ldGFsaW5rJywgJ2FwcGxpY2F0aW9uL21ldGFsaW5rK3htbCddLFxuICAgIFsnbWV0cycsICdhcHBsaWNhdGlvbi9tZXRzK3htbCddLFxuICAgIFsnbWZtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tZm1wJ10sXG4gICAgWydtZnQnLCAnYXBwbGljYXRpb24vcnBraS1tYW5pZmVzdCddLFxuICAgIFsnbWdwJywgJ2FwcGxpY2F0aW9uL3ZuZC5vc2dlby5tYXBndWlkZS5wYWNrYWdlJ10sXG4gICAgWydtZ3onLCAnYXBwbGljYXRpb24vdm5kLnByb3RldXMubWFnYXppbmUnXSxcbiAgICBbJ21pZCcsICdhdWRpby9taWRpJ10sXG4gICAgWydtaWRpJywgJ2F1ZGlvL21pZGknXSxcbiAgICBbJ21pZScsICdhcHBsaWNhdGlvbi94LW1pZSddLFxuICAgIFsnbWlmJywgJ2FwcGxpY2F0aW9uL3ZuZC5taWYnXSxcbiAgICBbJ21pbWUnLCAnbWVzc2FnZS9yZmM4MjInXSxcbiAgICBbJ21qMicsICd2aWRlby9tajInXSxcbiAgICBbJ21qcDInLCAndmlkZW8vbWoyJ10sXG4gICAgWydtanMnLCAnYXBwbGljYXRpb24vamF2YXNjcmlwdCddLFxuICAgIFsnbWszZCcsICd2aWRlby94LW1hdHJvc2thJ10sXG4gICAgWydta2EnLCAnYXVkaW8veC1tYXRyb3NrYSddLFxuICAgIFsnbWtkJywgJ3RleHQveC1tYXJrZG93biddLFxuICAgIFsnbWtzJywgJ3ZpZGVvL3gtbWF0cm9za2EnXSxcbiAgICBbJ21rdicsICd2aWRlby94LW1hdHJvc2thJ10sXG4gICAgWydtbHAnLCAnYXBwbGljYXRpb24vdm5kLmRvbGJ5Lm1scCddLFxuICAgIFsnbW1kJywgJ2FwcGxpY2F0aW9uL3ZuZC5jaGlwbnV0cy5rYXJhb2tlLW1tZCddLFxuICAgIFsnbW1mJywgJ2FwcGxpY2F0aW9uL3ZuZC5zbWFmJ10sXG4gICAgWydtbWwnLCAndGV4dC9tYXRobWwnXSxcbiAgICBbJ21tcicsICdpbWFnZS92bmQuZnVqaXhlcm94LmVkbWljcy1tbXInXSxcbiAgICBbJ21uZycsICd2aWRlby94LW1uZyddLFxuICAgIFsnbW55JywgJ2FwcGxpY2F0aW9uL3gtbXNtb25leSddLFxuICAgIFsnbW9iaScsICdhcHBsaWNhdGlvbi94LW1vYmlwb2NrZXQtZWJvb2snXSxcbiAgICBbJ21vZHMnLCAnYXBwbGljYXRpb24vbW9kcyt4bWwnXSxcbiAgICBbJ21vdicsICd2aWRlby9xdWlja3RpbWUnXSxcbiAgICBbJ21vdmllJywgJ3ZpZGVvL3gtc2dpLW1vdmllJ10sXG4gICAgWydtcDInLCAnYXVkaW8vbXBlZyddLFxuICAgIFsnbXAyYScsICdhdWRpby9tcGVnJ10sXG4gICAgWydtcDMnLCAnYXVkaW8vbXBlZyddLFxuICAgIFsnbXA0JywgJ3ZpZGVvL21wNCddLFxuICAgIFsnbXA0YScsICdhdWRpby9tcDQnXSxcbiAgICBbJ21wNHMnLCAnYXBwbGljYXRpb24vbXA0J10sXG4gICAgWydtcDR2JywgJ3ZpZGVvL21wNCddLFxuICAgIFsnbXAyMScsICdhcHBsaWNhdGlvbi9tcDIxJ10sXG4gICAgWydtcGMnLCAnYXBwbGljYXRpb24vdm5kLm1vcGh1bi5jZXJ0aWZpY2F0ZSddLFxuICAgIFsnbXBkJywgJ2FwcGxpY2F0aW9uL2Rhc2greG1sJ10sXG4gICAgWydtcGUnLCAndmlkZW8vbXBlZyddLFxuICAgIFsnbXBlZycsICd2aWRlby9tcGVnJ10sXG4gICAgWydtcGcnLCAndmlkZW8vbXBlZyddLFxuICAgIFsnbXBnNCcsICd2aWRlby9tcDQnXSxcbiAgICBbJ21wZ2EnLCAnYXVkaW8vbXBlZyddLFxuICAgIFsnbXBrZycsICdhcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbCddLFxuICAgIFsnbXBtJywgJ2FwcGxpY2F0aW9uL3ZuZC5ibHVlaWNlLm11bHRpcGFzcyddLFxuICAgIFsnbXBuJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb3BodW4uYXBwbGljYXRpb24nXSxcbiAgICBbJ21wcCcsICdhcHBsaWNhdGlvbi92bmQubXMtcHJvamVjdCddLFxuICAgIFsnbXB0JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wcm9qZWN0J10sXG4gICAgWydtcHknLCAnYXBwbGljYXRpb24vdm5kLmlibS5taW5pcGF5J10sXG4gICAgWydtcXknLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy5tcXknXSxcbiAgICBbJ21yYycsICdhcHBsaWNhdGlvbi9tYXJjJ10sXG4gICAgWydtcmN4JywgJ2FwcGxpY2F0aW9uL21hcmN4bWwreG1sJ10sXG4gICAgWydtcycsICd0ZXh0L3Ryb2ZmJ10sXG4gICAgWydtc2NtbCcsICdhcHBsaWNhdGlvbi9tZWRpYXNlcnZlcmNvbnRyb2wreG1sJ10sXG4gICAgWydtc2VlZCcsICdhcHBsaWNhdGlvbi92bmQuZmRzbi5tc2VlZCddLFxuICAgIFsnbXNlcScsICdhcHBsaWNhdGlvbi92bmQubXNlcSddLFxuICAgIFsnbXNmJywgJ2FwcGxpY2F0aW9uL3ZuZC5lcHNvbi5tc2YnXSxcbiAgICBbJ21zZycsICdhcHBsaWNhdGlvbi92bmQubXMtb3V0bG9vayddLFxuICAgIFsnbXNoJywgJ21vZGVsL21lc2gnXSxcbiAgICBbJ21zaScsICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnXSxcbiAgICBbJ21zbCcsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLm1zbCddLFxuICAgIFsnbXNtJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnbXNwJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnbXN0eScsICdhcHBsaWNhdGlvbi92bmQubXV2ZWUuc3R5bGUnXSxcbiAgICBbJ210bCcsICdtb2RlbC9tdGwnXSxcbiAgICBbJ210cycsICdtb2RlbC92bmQubXRzJ10sXG4gICAgWydtdXMnLCAnYXBwbGljYXRpb24vdm5kLm11c2ljaWFuJ10sXG4gICAgWydtdXNkJywgJ2FwcGxpY2F0aW9uL21tdC11c2QreG1sJ10sXG4gICAgWydtdXNpY3htbCcsICdhcHBsaWNhdGlvbi92bmQucmVjb3JkYXJlLm11c2ljeG1sK3htbCddLFxuICAgIFsnbXZiJywgJ2FwcGxpY2F0aW9uL3gtbXNtZWRpYXZpZXcnXSxcbiAgICBbJ212dCcsICdhcHBsaWNhdGlvbi92bmQubWFwYm94LXZlY3Rvci10aWxlJ10sXG4gICAgWydtd2YnLCAnYXBwbGljYXRpb24vdm5kLm1mZXInXSxcbiAgICBbJ214ZicsICdhcHBsaWNhdGlvbi9teGYnXSxcbiAgICBbJ214bCcsICdhcHBsaWNhdGlvbi92bmQucmVjb3JkYXJlLm11c2ljeG1sJ10sXG4gICAgWydteG1mJywgJ2F1ZGlvL21vYmlsZS14bWYnXSxcbiAgICBbJ214bWwnLCAnYXBwbGljYXRpb24veHYreG1sJ10sXG4gICAgWydteHMnLCAnYXBwbGljYXRpb24vdm5kLnRyaXNjYXBlLm14cyddLFxuICAgIFsnbXh1JywgJ3ZpZGVvL3ZuZC5tcGVndXJsJ10sXG4gICAgWyduLWdhZ2UnLCAnYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5zeW1iaWFuLmluc3RhbGwnXSxcbiAgICBbJ24zJywgJ3RleHQvbjMnXSxcbiAgICBbJ25iJywgJ2FwcGxpY2F0aW9uL21hdGhlbWF0aWNhJ10sXG4gICAgWyduYnAnLCAnYXBwbGljYXRpb24vdm5kLndvbGZyYW0ucGxheWVyJ10sXG4gICAgWyduYycsICdhcHBsaWNhdGlvbi94LW5ldGNkZiddLFxuICAgIFsnbmN4JywgJ2FwcGxpY2F0aW9uL3gtZHRibmN4K3htbCddLFxuICAgIFsnbmZvJywgJ3RleHQveC1uZm8nXSxcbiAgICBbJ25nZGF0JywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2UuZGF0YSddLFxuICAgIFsnbml0ZicsICdhcHBsaWNhdGlvbi92bmQubml0ZiddLFxuICAgIFsnbmx1JywgJ2FwcGxpY2F0aW9uL3ZuZC5uZXVyb2xhbmd1YWdlLm5sdSddLFxuICAgIFsnbm1sJywgJ2FwcGxpY2F0aW9uL3ZuZC5lbmxpdmVuJ10sXG4gICAgWydubmQnLCAnYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LWRpcmVjdG9yeSddLFxuICAgIFsnbm5zJywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC1zZWFsZXInXSxcbiAgICBbJ25udycsICdhcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtd2ViJ10sXG4gICAgWyducHgnLCAnaW1hZ2Uvdm5kLm5ldC1mcHgnXSxcbiAgICBbJ25xJywgJ2FwcGxpY2F0aW9uL24tcXVhZHMnXSxcbiAgICBbJ25zYycsICdhcHBsaWNhdGlvbi94LWNvbmZlcmVuY2UnXSxcbiAgICBbJ25zZicsICdhcHBsaWNhdGlvbi92bmQubG90dXMtbm90ZXMnXSxcbiAgICBbJ250JywgJ2FwcGxpY2F0aW9uL24tdHJpcGxlcyddLFxuICAgIFsnbnRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5uaXRmJ10sXG4gICAgWydudW1iZXJzJywgJ2FwcGxpY2F0aW9uL3gtaXdvcmstbnVtYmVycy1zZmZudW1iZXJzJ10sXG4gICAgWyduemInLCAnYXBwbGljYXRpb24veC1uemInXSxcbiAgICBbJ29hMicsICdhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5czInXSxcbiAgICBbJ29hMycsICdhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5czMnXSxcbiAgICBbJ29hcycsICdhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5cyddLFxuICAgIFsnb2JkJywgJ2FwcGxpY2F0aW9uL3gtbXNiaW5kZXInXSxcbiAgICBbJ29iZ3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW5ibG94LmdhbWUreG1sJ10sXG4gICAgWydvYmonLCAnbW9kZWwvb2JqJ10sXG4gICAgWydvZGEnLCAnYXBwbGljYXRpb24vb2RhJ10sXG4gICAgWydvZGInLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5kYXRhYmFzZSddLFxuICAgIFsnb2RjJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuY2hhcnQnXSxcbiAgICBbJ29kZicsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmZvcm11bGEnXSxcbiAgICBbJ29kZnQnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5mb3JtdWxhLXRlbXBsYXRlJ10sXG4gICAgWydvZGcnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5ncmFwaGljcyddLFxuICAgIFsnb2RpJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuaW1hZ2UnXSxcbiAgICBbJ29kbScsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtbWFzdGVyJ10sXG4gICAgWydvZHAnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nXSxcbiAgICBbJ29kcycsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0J10sXG4gICAgWydvZHQnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0J10sXG4gICAgWydvZ2EnLCAnYXVkaW8vb2dnJ10sXG4gICAgWydvZ2V4JywgJ21vZGVsL3ZuZC5vcGVuZ2V4J10sXG4gICAgWydvZ2cnLCAnYXVkaW8vb2dnJ10sXG4gICAgWydvZ3YnLCAndmlkZW8vb2dnJ10sXG4gICAgWydvZ3gnLCAnYXBwbGljYXRpb24vb2dnJ10sXG4gICAgWydvbWRvYycsICdhcHBsaWNhdGlvbi9vbWRvYyt4bWwnXSxcbiAgICBbJ29uZXBrZycsICdhcHBsaWNhdGlvbi9vbmVub3RlJ10sXG4gICAgWydvbmV0bXAnLCAnYXBwbGljYXRpb24vb25lbm90ZSddLFxuICAgIFsnb25ldG9jJywgJ2FwcGxpY2F0aW9uL29uZW5vdGUnXSxcbiAgICBbJ29uZXRvYzInLCAnYXBwbGljYXRpb24vb25lbm90ZSddLFxuICAgIFsnb3BmJywgJ2FwcGxpY2F0aW9uL29lYnBzLXBhY2thZ2UreG1sJ10sXG4gICAgWydvcG1sJywgJ3RleHQveC1vcG1sJ10sXG4gICAgWydvcHJjJywgJ2FwcGxpY2F0aW9uL3ZuZC5wYWxtJ10sXG4gICAgWydvcHVzJywgJ2F1ZGlvL29nZyddLFxuICAgIFsnb3JnJywgJ3RleHQveC1vcmcnXSxcbiAgICBbJ29zZicsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLm9wZW5zY29yZWZvcm1hdCddLFxuICAgIFsnb3NmcHZnJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEub3BlbnNjb3JlZm9ybWF0Lm9zZnB2Zyt4bWwnXSxcbiAgICBbJ29zbScsICdhcHBsaWNhdGlvbi92bmQub3BlbnN0cmVldG1hcC5kYXRhK3htbCddLFxuICAgIFsnb3RjJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuY2hhcnQtdGVtcGxhdGUnXSxcbiAgICBbJ290ZicsICdmb250L290ZiddLFxuICAgIFsnb3RnJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZ3JhcGhpY3MtdGVtcGxhdGUnXSxcbiAgICBbJ290aCcsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtd2ViJ10sXG4gICAgWydvdGknLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5pbWFnZS10ZW1wbGF0ZSddLFxuICAgIFsnb3RwJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uLXRlbXBsYXRlJ10sXG4gICAgWydvdHMnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldC10ZW1wbGF0ZSddLFxuICAgIFsnb3R0JywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC10ZW1wbGF0ZSddLFxuICAgIFsnb3ZhJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1vdmEnXSxcbiAgICBbJ292ZicsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtb3ZmJ10sXG4gICAgWydvd2wnLCAnYXBwbGljYXRpb24vcmRmK3htbCddLFxuICAgIFsnb3hwcycsICdhcHBsaWNhdGlvbi9veHBzJ10sXG4gICAgWydveHQnLCAnYXBwbGljYXRpb24vdm5kLm9wZW5vZmZpY2VvcmcuZXh0ZW5zaW9uJ10sXG4gICAgWydwJywgJ3RleHQveC1wYXNjYWwnXSxcbiAgICBbJ3A3YScsICdhcHBsaWNhdGlvbi94LXBrY3M3LXNpZ25hdHVyZSddLFxuICAgIFsncDdiJywgJ2FwcGxpY2F0aW9uL3gtcGtjczctY2VydGlmaWNhdGVzJ10sXG4gICAgWydwN2MnLCAnYXBwbGljYXRpb24vcGtjczctbWltZSddLFxuICAgIFsncDdtJywgJ2FwcGxpY2F0aW9uL3BrY3M3LW1pbWUnXSxcbiAgICBbJ3A3cicsICdhcHBsaWNhdGlvbi94LXBrY3M3LWNlcnRyZXFyZXNwJ10sXG4gICAgWydwN3MnLCAnYXBwbGljYXRpb24vcGtjczctc2lnbmF0dXJlJ10sXG4gICAgWydwOCcsICdhcHBsaWNhdGlvbi9wa2NzOCddLFxuICAgIFsncDEwJywgJ2FwcGxpY2F0aW9uL3gtcGtjczEwJ10sXG4gICAgWydwMTInLCAnYXBwbGljYXRpb24veC1wa2NzMTInXSxcbiAgICBbJ3BhYycsICdhcHBsaWNhdGlvbi94LW5zLXByb3h5LWF1dG9jb25maWcnXSxcbiAgICBbJ3BhZ2VzJywgJ2FwcGxpY2F0aW9uL3gtaXdvcmstcGFnZXMtc2ZmcGFnZXMnXSxcbiAgICBbJ3BhcycsICd0ZXh0L3gtcGFzY2FsJ10sXG4gICAgWydwYXcnLCAnYXBwbGljYXRpb24vdm5kLnBhd2FhZmlsZSddLFxuICAgIFsncGJkJywgJ2FwcGxpY2F0aW9uL3ZuZC5wb3dlcmJ1aWxkZXI2J10sXG4gICAgWydwYm0nLCAnaW1hZ2UveC1wb3J0YWJsZS1iaXRtYXAnXSxcbiAgICBbJ3BjYXAnLCAnYXBwbGljYXRpb24vdm5kLnRjcGR1bXAucGNhcCddLFxuICAgIFsncGNmJywgJ2FwcGxpY2F0aW9uL3gtZm9udC1wY2YnXSxcbiAgICBbJ3BjbCcsICdhcHBsaWNhdGlvbi92bmQuaHAtcGNsJ10sXG4gICAgWydwY2x4bCcsICdhcHBsaWNhdGlvbi92bmQuaHAtcGNseGwnXSxcbiAgICBbJ3BjdCcsICdpbWFnZS94LXBpY3QnXSxcbiAgICBbJ3BjdXJsJywgJ2FwcGxpY2F0aW9uL3ZuZC5jdXJsLnBjdXJsJ10sXG4gICAgWydwY3gnLCAnaW1hZ2UveC1wY3gnXSxcbiAgICBbJ3BkYicsICdhcHBsaWNhdGlvbi94LXBpbG90J10sXG4gICAgWydwZGUnLCAndGV4dC94LXByb2Nlc3NpbmcnXSxcbiAgICBbJ3BkZicsICdhcHBsaWNhdGlvbi9wZGYnXSxcbiAgICBbJ3BlbScsICdhcHBsaWNhdGlvbi94LXg1MDktdXNlci1jZXJ0J10sXG4gICAgWydwZmEnLCAnYXBwbGljYXRpb24veC1mb250LXR5cGUxJ10sXG4gICAgWydwZmInLCAnYXBwbGljYXRpb24veC1mb250LXR5cGUxJ10sXG4gICAgWydwZm0nLCAnYXBwbGljYXRpb24veC1mb250LXR5cGUxJ10sXG4gICAgWydwZnInLCAnYXBwbGljYXRpb24vZm9udC10ZHBmciddLFxuICAgIFsncGZ4JywgJ2FwcGxpY2F0aW9uL3gtcGtjczEyJ10sXG4gICAgWydwZ20nLCAnaW1hZ2UveC1wb3J0YWJsZS1ncmF5bWFwJ10sXG4gICAgWydwZ24nLCAnYXBwbGljYXRpb24veC1jaGVzcy1wZ24nXSxcbiAgICBbJ3BncCcsICdhcHBsaWNhdGlvbi9wZ3AnXSxcbiAgICBbJ3BocCcsICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCddLFxuICAgIFsncGhwMycsICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCddLFxuICAgIFsncGhwNCcsICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCddLFxuICAgIFsncGhwcycsICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocC1zb3VyY2UnXSxcbiAgICBbJ3BodG1sJywgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJ10sXG4gICAgWydwaWMnLCAnaW1hZ2UveC1waWN0J10sXG4gICAgWydwa2cnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydwa2knLCAnYXBwbGljYXRpb24vcGtpeGNtcCddLFxuICAgIFsncGtpcGF0aCcsICdhcHBsaWNhdGlvbi9wa2l4LXBraXBhdGgnXSxcbiAgICBbJ3BrcGFzcycsICdhcHBsaWNhdGlvbi92bmQuYXBwbGUucGtwYXNzJ10sXG4gICAgWydwbCcsICdhcHBsaWNhdGlvbi94LXBlcmwnXSxcbiAgICBbJ3BsYicsICdhcHBsaWNhdGlvbi92bmQuM2dwcC5waWMtYnctbGFyZ2UnXSxcbiAgICBbJ3BsYycsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLnBsYyddLFxuICAgIFsncGxmJywgJ2FwcGxpY2F0aW9uL3ZuZC5wb2NrZXRsZWFybiddLFxuICAgIFsncGxzJywgJ2FwcGxpY2F0aW9uL3Bscyt4bWwnXSxcbiAgICBbJ3BtJywgJ2FwcGxpY2F0aW9uL3gtcGVybCddLFxuICAgIFsncG1sJywgJ2FwcGxpY2F0aW9uL3ZuZC5jdGMtcG9zbWwnXSxcbiAgICBbJ3BuZycsICdpbWFnZS9wbmcnXSxcbiAgICBbJ3BubScsICdpbWFnZS94LXBvcnRhYmxlLWFueW1hcCddLFxuICAgIFsncG9ydHBrZycsICdhcHBsaWNhdGlvbi92bmQubWFjcG9ydHMucG9ydHBrZyddLFxuICAgIFsncG90JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J10sXG4gICAgWydwb3RtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnByZXNlbnRhdGlvbi5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3BvdHgnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnRlbXBsYXRlJ10sXG4gICAgWydwcGEnLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXSxcbiAgICBbJ3BwYW0nLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuYWRkaW4ubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWydwcGQnLCAnYXBwbGljYXRpb24vdm5kLmN1cHMtcHBkJ10sXG4gICAgWydwcG0nLCAnaW1hZ2UveC1wb3J0YWJsZS1waXhtYXAnXSxcbiAgICBbJ3BwcycsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCddLFxuICAgIFsncHBzbScsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZXNob3cubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWydwcHN4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZXNob3cnXSxcbiAgICBbJ3BwdCcsICdhcHBsaWNhdGlvbi9wb3dlcnBvaW50J10sXG4gICAgWydwcHRtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnByZXNlbnRhdGlvbi5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3BwdHgnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbiddLFxuICAgIFsncHFhJywgJ2FwcGxpY2F0aW9uL3ZuZC5wYWxtJ10sXG4gICAgWydwcmMnLCAnYXBwbGljYXRpb24veC1waWxvdCddLFxuICAgIFsncHJlJywgJ2FwcGxpY2F0aW9uL3ZuZC5sb3R1cy1mcmVlbGFuY2UnXSxcbiAgICBbJ3ByZicsICdhcHBsaWNhdGlvbi9waWNzLXJ1bGVzJ10sXG4gICAgWydwcm92eCcsICdhcHBsaWNhdGlvbi9wcm92ZW5hbmNlK3htbCddLFxuICAgIFsncHMnLCAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCddLFxuICAgIFsncHNiJywgJ2FwcGxpY2F0aW9uL3ZuZC4zZ3BwLnBpYy1idy1zbWFsbCddLFxuICAgIFsncHNkJywgJ2FwcGxpY2F0aW9uL3gtcGhvdG9zaG9wJ10sXG4gICAgWydwc2YnLCAnYXBwbGljYXRpb24veC1mb250LWxpbnV4LXBzZiddLFxuICAgIFsncHNrY3htbCcsICdhcHBsaWNhdGlvbi9wc2tjK3htbCddLFxuICAgIFsncHRpJywgJ2ltYWdlL3Bycy5wdGknXSxcbiAgICBbJ3B0aWQnLCAnYXBwbGljYXRpb24vdm5kLnB2aS5wdGlkMSddLFxuICAgIFsncHViJywgJ2FwcGxpY2F0aW9uL3gtbXNwdWJsaXNoZXInXSxcbiAgICBbJ3B2YicsICdhcHBsaWNhdGlvbi92bmQuM2dwcC5waWMtYnctdmFyJ10sXG4gICAgWydwd24nLCAnYXBwbGljYXRpb24vdm5kLjNtLnBvc3QtaXQtbm90ZXMnXSxcbiAgICBbJ3B5YScsICdhdWRpby92bmQubXMtcGxheXJlYWR5Lm1lZGlhLnB5YSddLFxuICAgIFsncHl2JywgJ3ZpZGVvL3ZuZC5tcy1wbGF5cmVhZHkubWVkaWEucHl2J10sXG4gICAgWydxYW0nLCAnYXBwbGljYXRpb24vdm5kLmVwc29uLnF1aWNrYW5pbWUnXSxcbiAgICBbJ3FibycsICdhcHBsaWNhdGlvbi92bmQuaW50dS5xYm8nXSxcbiAgICBbJ3FmeCcsICdhcHBsaWNhdGlvbi92bmQuaW50dS5xZngnXSxcbiAgICBbJ3FwcycsICdhcHBsaWNhdGlvbi92bmQucHVibGlzaGFyZS1kZWx0YS10cmVlJ10sXG4gICAgWydxdCcsICd2aWRlby9xdWlja3RpbWUnXSxcbiAgICBbJ3F3ZCcsICdhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3MnXSxcbiAgICBbJ3F3dCcsICdhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3MnXSxcbiAgICBbJ3F4YicsICdhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3MnXSxcbiAgICBbJ3F4ZCcsICdhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3MnXSxcbiAgICBbJ3F4bCcsICdhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3MnXSxcbiAgICBbJ3F4dCcsICdhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3MnXSxcbiAgICBbJ3JhJywgJ2F1ZGlvL3gtcmVhbGF1ZGlvJ10sXG4gICAgWydyYW0nLCAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXSxcbiAgICBbJ3JhbWwnLCAnYXBwbGljYXRpb24vcmFtbCt5YW1sJ10sXG4gICAgWydyYXBkJywgJ2FwcGxpY2F0aW9uL3JvdXRlLWFwZCt4bWwnXSxcbiAgICBbJ3JhcicsICdhcHBsaWNhdGlvbi94LXJhciddLFxuICAgIFsncmFzJywgJ2ltYWdlL3gtY211LXJhc3RlciddLFxuICAgIFsncmNwcm9maWxlJywgJ2FwcGxpY2F0aW9uL3ZuZC5pcHVucGx1Z2dlZC5yY3Byb2ZpbGUnXSxcbiAgICBbJ3JkZicsICdhcHBsaWNhdGlvbi9yZGYreG1sJ10sXG4gICAgWydyZHonLCAnYXBwbGljYXRpb24vdm5kLmRhdGEtdmlzaW9uLnJkeiddLFxuICAgIFsncmVsbycsICdhcHBsaWNhdGlvbi9wMnAtb3ZlcmxheSt4bWwnXSxcbiAgICBbJ3JlcCcsICdhcHBsaWNhdGlvbi92bmQuYnVzaW5lc3NvYmplY3RzJ10sXG4gICAgWydyZXMnLCAnYXBwbGljYXRpb24veC1kdGJyZXNvdXJjZSt4bWwnXSxcbiAgICBbJ3JnYicsICdpbWFnZS94LXJnYiddLFxuICAgIFsncmlmJywgJ2FwcGxpY2F0aW9uL3JlZ2luZm8reG1sJ10sXG4gICAgWydyaXAnLCAnYXVkaW8vdm5kLnJpcCddLFxuICAgIFsncmlzJywgJ2FwcGxpY2F0aW9uL3gtcmVzZWFyY2gtaW5mby1zeXN0ZW1zJ10sXG4gICAgWydybCcsICdhcHBsaWNhdGlvbi9yZXNvdXJjZS1saXN0cyt4bWwnXSxcbiAgICBbJ3JsYycsICdpbWFnZS92bmQuZnVqaXhlcm94LmVkbWljcy1ybGMnXSxcbiAgICBbJ3JsZCcsICdhcHBsaWNhdGlvbi9yZXNvdXJjZS1saXN0cy1kaWZmK3htbCddLFxuICAgIFsncm0nLCAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXSxcbiAgICBbJ3JtaScsICdhdWRpby9taWRpJ10sXG4gICAgWydybXAnLCAnYXVkaW8veC1wbi1yZWFsYXVkaW8tcGx1Z2luJ10sXG4gICAgWydybXMnLCAnYXBwbGljYXRpb24vdm5kLmpjcC5qYXZhbWUubWlkbGV0LXJtcyddLFxuICAgIFsncm12YicsICdhcHBsaWNhdGlvbi92bmQucm4tcmVhbG1lZGlhLXZiciddLFxuICAgIFsncm5jJywgJ2FwcGxpY2F0aW9uL3JlbGF4LW5nLWNvbXBhY3Qtc3ludGF4J10sXG4gICAgWydybmcnLCAnYXBwbGljYXRpb24veG1sJ10sXG4gICAgWydyb2EnLCAnYXBwbGljYXRpb24vcnBraS1yb2EnXSxcbiAgICBbJ3JvZmYnLCAndGV4dC90cm9mZiddLFxuICAgIFsncnA5JywgJ2FwcGxpY2F0aW9uL3ZuZC5jbG9hbnRvLnJwOSddLFxuICAgIFsncnBtJywgJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvLXBsdWdpbiddLFxuICAgIFsncnBzcycsICdhcHBsaWNhdGlvbi92bmQubm9raWEucmFkaW8tcHJlc2V0cyddLFxuICAgIFsncnBzdCcsICdhcHBsaWNhdGlvbi92bmQubm9raWEucmFkaW8tcHJlc2V0J10sXG4gICAgWydycScsICdhcHBsaWNhdGlvbi9zcGFycWwtcXVlcnknXSxcbiAgICBbJ3JzJywgJ2FwcGxpY2F0aW9uL3Jscy1zZXJ2aWNlcyt4bWwnXSxcbiAgICBbJ3JzYScsICdhcHBsaWNhdGlvbi94LXBrY3M3J10sXG4gICAgWydyc2F0JywgJ2FwcGxpY2F0aW9uL2F0c2MtcnNhdCt4bWwnXSxcbiAgICBbJ3JzZCcsICdhcHBsaWNhdGlvbi9yc2QreG1sJ10sXG4gICAgWydyc2hlZXQnLCAnYXBwbGljYXRpb24vdXJjLXJlc3NoZWV0K3htbCddLFxuICAgIFsncnNzJywgJ2FwcGxpY2F0aW9uL3Jzcyt4bWwnXSxcbiAgICBbJ3J0ZicsICd0ZXh0L3J0ZiddLFxuICAgIFsncnR4JywgJ3RleHQvcmljaHRleHQnXSxcbiAgICBbJ3J1bicsICdhcHBsaWNhdGlvbi94LW1ha2VzZWxmJ10sXG4gICAgWydydXNkJywgJ2FwcGxpY2F0aW9uL3JvdXRlLXVzZCt4bWwnXSxcbiAgICBbJ3J2JywgJ3ZpZGVvL3ZuZC5ybi1yZWFsdmlkZW8nXSxcbiAgICBbJ3MnLCAndGV4dC94LWFzbSddLFxuICAgIFsnczNtJywgJ2F1ZGlvL3MzbSddLFxuICAgIFsnc2FmJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEuc21hZi1hdWRpbyddLFxuICAgIFsnc2FzcycsICd0ZXh0L3gtc2FzcyddLFxuICAgIFsnc2JtbCcsICdhcHBsaWNhdGlvbi9zYm1sK3htbCddLFxuICAgIFsnc2MnLCAnYXBwbGljYXRpb24vdm5kLmlibS5zZWN1cmUtY29udGFpbmVyJ10sXG4gICAgWydzY2QnLCAnYXBwbGljYXRpb24veC1tc3NjaGVkdWxlJ10sXG4gICAgWydzY20nLCAnYXBwbGljYXRpb24vdm5kLmxvdHVzLXNjcmVlbmNhbSddLFxuICAgIFsnc2NxJywgJ2FwcGxpY2F0aW9uL3NjdnAtY3YtcmVxdWVzdCddLFxuICAgIFsnc2NzJywgJ2FwcGxpY2F0aW9uL3NjdnAtY3YtcmVzcG9uc2UnXSxcbiAgICBbJ3Njc3MnLCAndGV4dC94LXNjc3MnXSxcbiAgICBbJ3NjdXJsJywgJ3RleHQvdm5kLmN1cmwuc2N1cmwnXSxcbiAgICBbJ3NkYScsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmRyYXcnXSxcbiAgICBbJ3NkYycsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmNhbGMnXSxcbiAgICBbJ3NkZCcsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmltcHJlc3MnXSxcbiAgICBbJ3Nka2QnLCAnYXBwbGljYXRpb24vdm5kLnNvbGVudC5zZGttK3htbCddLFxuICAgIFsnc2RrbScsICdhcHBsaWNhdGlvbi92bmQuc29sZW50LnNka20reG1sJ10sXG4gICAgWydzZHAnLCAnYXBwbGljYXRpb24vc2RwJ10sXG4gICAgWydzZHcnLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi53cml0ZXInXSxcbiAgICBbJ3NlYScsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ3NlZScsICdhcHBsaWNhdGlvbi92bmQuc2VlbWFpbCddLFxuICAgIFsnc2VlZCcsICdhcHBsaWNhdGlvbi92bmQuZmRzbi5zZWVkJ10sXG4gICAgWydzZW1hJywgJ2FwcGxpY2F0aW9uL3ZuZC5zZW1hJ10sXG4gICAgWydzZW1kJywgJ2FwcGxpY2F0aW9uL3ZuZC5zZW1kJ10sXG4gICAgWydzZW1mJywgJ2FwcGxpY2F0aW9uL3ZuZC5zZW1mJ10sXG4gICAgWydzZW5tbHgnLCAnYXBwbGljYXRpb24vc2VubWwreG1sJ10sXG4gICAgWydzZW5zbWx4JywgJ2FwcGxpY2F0aW9uL3NlbnNtbCt4bWwnXSxcbiAgICBbJ3NlcicsICdhcHBsaWNhdGlvbi9qYXZhLXNlcmlhbGl6ZWQtb2JqZWN0J10sXG4gICAgWydzZXRwYXknLCAnYXBwbGljYXRpb24vc2V0LXBheW1lbnQtaW5pdGlhdGlvbiddLFxuICAgIFsnc2V0cmVnJywgJ2FwcGxpY2F0aW9uL3NldC1yZWdpc3RyYXRpb24taW5pdGlhdGlvbiddLFxuICAgIFsnc2ZkLWhkc3R4JywgJ2FwcGxpY2F0aW9uL3ZuZC5oeWRyb3N0YXRpeC5zb2YtZGF0YSddLFxuICAgIFsnc2ZzJywgJ2FwcGxpY2F0aW9uL3ZuZC5zcG90ZmlyZS5zZnMnXSxcbiAgICBbJ3NmdicsICd0ZXh0L3gtc2Z2J10sXG4gICAgWydzZ2knLCAnaW1hZ2Uvc2dpJ10sXG4gICAgWydzZ2wnLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi53cml0ZXItZ2xvYmFsJ10sXG4gICAgWydzZ20nLCAndGV4dC9zZ21sJ10sXG4gICAgWydzZ21sJywgJ3RleHQvc2dtbCddLFxuICAgIFsnc2gnLCAnYXBwbGljYXRpb24veC1zaCddLFxuICAgIFsnc2hhcicsICdhcHBsaWNhdGlvbi94LXNoYXInXSxcbiAgICBbJ3NoZXgnLCAndGV4dC9zaGV4J10sXG4gICAgWydzaGYnLCAnYXBwbGljYXRpb24vc2hmK3htbCddLFxuICAgIFsnc2h0bWwnLCAndGV4dC9odG1sJ10sXG4gICAgWydzaWQnLCAnaW1hZ2UveC1tcnNpZC1pbWFnZSddLFxuICAgIFsnc2lldmUnLCAnYXBwbGljYXRpb24vc2lldmUnXSxcbiAgICBbJ3NpZycsICdhcHBsaWNhdGlvbi9wZ3Atc2lnbmF0dXJlJ10sXG4gICAgWydzaWwnLCAnYXVkaW8vc2lsayddLFxuICAgIFsnc2lsbycsICdtb2RlbC9tZXNoJ10sXG4gICAgWydzaXMnLCAnYXBwbGljYXRpb24vdm5kLnN5bWJpYW4uaW5zdGFsbCddLFxuICAgIFsnc2lzeCcsICdhcHBsaWNhdGlvbi92bmQuc3ltYmlhbi5pbnN0YWxsJ10sXG4gICAgWydzaXQnLCAnYXBwbGljYXRpb24veC1zdHVmZml0J10sXG4gICAgWydzaXR4JywgJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdHgnXSxcbiAgICBbJ3NpdicsICdhcHBsaWNhdGlvbi9zaWV2ZSddLFxuICAgIFsnc2tkJywgJ2FwcGxpY2F0aW9uL3ZuZC5rb2FuJ10sXG4gICAgWydza20nLCAnYXBwbGljYXRpb24vdm5kLmtvYW4nXSxcbiAgICBbJ3NrcCcsICdhcHBsaWNhdGlvbi92bmQua29hbiddLFxuICAgIFsnc2t0JywgJ2FwcGxpY2F0aW9uL3ZuZC5rb2FuJ10sXG4gICAgWydzbGRtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnNsaWRlLm1hY3JvZW5hYmxlZC4xMiddLFxuICAgIFsnc2xkeCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGUnXSxcbiAgICBbJ3NsaW0nLCAndGV4dC9zbGltJ10sXG4gICAgWydzbG0nLCAndGV4dC9zbGltJ10sXG4gICAgWydzbHMnLCAnYXBwbGljYXRpb24vcm91dGUtcy10c2lkK3htbCddLFxuICAgIFsnc2x0JywgJ2FwcGxpY2F0aW9uL3ZuZC5lcHNvbi5zYWx0J10sXG4gICAgWydzbScsICdhcHBsaWNhdGlvbi92bmQuc3RlcG1hbmlhLnN0ZXBjaGFydCddLFxuICAgIFsnc21mJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24ubWF0aCddLFxuICAgIFsnc21pJywgJ2FwcGxpY2F0aW9uL3NtaWwnXSxcbiAgICBbJ3NtaWwnLCAnYXBwbGljYXRpb24vc21pbCddLFxuICAgIFsnc212JywgJ3ZpZGVvL3gtc212J10sXG4gICAgWydzbXppcCcsICdhcHBsaWNhdGlvbi92bmQuc3RlcG1hbmlhLnBhY2thZ2UnXSxcbiAgICBbJ3NuZCcsICdhdWRpby9iYXNpYyddLFxuICAgIFsnc25mJywgJ2FwcGxpY2F0aW9uL3gtZm9udC1zbmYnXSxcbiAgICBbJ3NvJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnc3BjJywgJ2FwcGxpY2F0aW9uL3gtcGtjczctY2VydGlmaWNhdGVzJ10sXG4gICAgWydzcGR4JywgJ3RleHQvc3BkeCddLFxuICAgIFsnc3BmJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEuc21hZi1waHJhc2UnXSxcbiAgICBbJ3NwbCcsICdhcHBsaWNhdGlvbi94LWZ1dHVyZXNwbGFzaCddLFxuICAgIFsnc3BvdCcsICd0ZXh0L3ZuZC5pbjNkLnNwb3QnXSxcbiAgICBbJ3NwcCcsICdhcHBsaWNhdGlvbi9zY3ZwLXZwLXJlc3BvbnNlJ10sXG4gICAgWydzcHEnLCAnYXBwbGljYXRpb24vc2N2cC12cC1yZXF1ZXN0J10sXG4gICAgWydzcHgnLCAnYXVkaW8vb2dnJ10sXG4gICAgWydzcWwnLCAnYXBwbGljYXRpb24veC1zcWwnXSxcbiAgICBbJ3NyYycsICdhcHBsaWNhdGlvbi94LXdhaXMtc291cmNlJ10sXG4gICAgWydzcnQnLCAnYXBwbGljYXRpb24veC1zdWJyaXAnXSxcbiAgICBbJ3NydScsICdhcHBsaWNhdGlvbi9zcnUreG1sJ10sXG4gICAgWydzcngnLCAnYXBwbGljYXRpb24vc3BhcnFsLXJlc3VsdHMreG1sJ10sXG4gICAgWydzc2RsJywgJ2FwcGxpY2F0aW9uL3NzZGwreG1sJ10sXG4gICAgWydzc2UnLCAnYXBwbGljYXRpb24vdm5kLmtvZGFrLWRlc2NyaXB0b3InXSxcbiAgICBbJ3NzZicsICdhcHBsaWNhdGlvbi92bmQuZXBzb24uc3NmJ10sXG4gICAgWydzc21sJywgJ2FwcGxpY2F0aW9uL3NzbWwreG1sJ10sXG4gICAgWydzc3QnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydzdCcsICdhcHBsaWNhdGlvbi92bmQuc2FpbGluZ3RyYWNrZXIudHJhY2snXSxcbiAgICBbJ3N0YycsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5jYWxjLnRlbXBsYXRlJ10sXG4gICAgWydzdGQnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuZHJhdy50ZW1wbGF0ZSddLFxuICAgIFsnc3RmJywgJ2FwcGxpY2F0aW9uL3ZuZC53dC5zdGYnXSxcbiAgICBbJ3N0aScsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzLnRlbXBsYXRlJ10sXG4gICAgWydzdGsnLCAnYXBwbGljYXRpb24vaHlwZXJzdHVkaW8nXSxcbiAgICBbJ3N0bCcsICdtb2RlbC9zdGwnXSxcbiAgICBbJ3N0cHgnLCAnbW9kZWwvc3RlcCt4bWwnXSxcbiAgICBbJ3N0cHh6JywgJ21vZGVsL3N0ZXAteG1sK3ppcCddLFxuICAgIFsnc3RweicsICdtb2RlbC9zdGVwK3ppcCddLFxuICAgIFsnc3RyJywgJ2FwcGxpY2F0aW9uL3ZuZC5wZy5mb3JtYXQnXSxcbiAgICBbJ3N0dycsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXIudGVtcGxhdGUnXSxcbiAgICBbJ3N0eWwnLCAndGV4dC9zdHlsdXMnXSxcbiAgICBbJ3N0eWx1cycsICd0ZXh0L3N0eWx1cyddLFxuICAgIFsnc3ViJywgJ3RleHQvdm5kLmR2Yi5zdWJ0aXRsZSddLFxuICAgIFsnc3VzJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdXMtY2FsZW5kYXInXSxcbiAgICBbJ3N1c3AnLCAnYXBwbGljYXRpb24vdm5kLnN1cy1jYWxlbmRhciddLFxuICAgIFsnc3Y0Y3BpbycsICdhcHBsaWNhdGlvbi94LXN2NGNwaW8nXSxcbiAgICBbJ3N2NGNyYycsICdhcHBsaWNhdGlvbi94LXN2NGNyYyddLFxuICAgIFsnc3ZjJywgJ2FwcGxpY2F0aW9uL3ZuZC5kdmIuc2VydmljZSddLFxuICAgIFsnc3ZkJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdmQnXSxcbiAgICBbJ3N2ZycsICdpbWFnZS9zdmcreG1sJ10sXG4gICAgWydzdmd6JywgJ2ltYWdlL3N2Zyt4bWwnXSxcbiAgICBbJ3N3YScsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydzd2YnLCAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXSxcbiAgICBbJ3N3aScsICdhcHBsaWNhdGlvbi92bmQuYXJpc3RhbmV0d29ya3Muc3dpJ10sXG4gICAgWydzd2lkdGFnJywgJ2FwcGxpY2F0aW9uL3N3aWQreG1sJ10sXG4gICAgWydzeGMnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuY2FsYyddLFxuICAgIFsnc3hkJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmRyYXcnXSxcbiAgICBbJ3N4ZycsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXIuZ2xvYmFsJ10sXG4gICAgWydzeGknLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuaW1wcmVzcyddLFxuICAgIFsnc3htJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLm1hdGgnXSxcbiAgICBbJ3N4dycsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXInXSxcbiAgICBbJ3QnLCAndGV4dC90cm9mZiddLFxuICAgIFsndDMnLCAnYXBwbGljYXRpb24veC10M3ZtLWltYWdlJ10sXG4gICAgWyd0MzgnLCAnaW1hZ2UvdDM4J10sXG4gICAgWyd0YWdsZXQnLCAnYXBwbGljYXRpb24vdm5kLm15bmZjJ10sXG4gICAgWyd0YW8nLCAnYXBwbGljYXRpb24vdm5kLnRhby5pbnRlbnQtbW9kdWxlLWFyY2hpdmUnXSxcbiAgICBbJ3RhcCcsICdpbWFnZS92bmQudGVuY2VudC50YXAnXSxcbiAgICBbJ3RhcicsICdhcHBsaWNhdGlvbi94LXRhciddLFxuICAgIFsndGNhcCcsICdhcHBsaWNhdGlvbi92bmQuM2dwcDIudGNhcCddLFxuICAgIFsndGNsJywgJ2FwcGxpY2F0aW9uL3gtdGNsJ10sXG4gICAgWyd0ZCcsICdhcHBsaWNhdGlvbi91cmMtdGFyZ2V0ZGVzYyt4bWwnXSxcbiAgICBbJ3RlYWNoZXInLCAnYXBwbGljYXRpb24vdm5kLnNtYXJ0LnRlYWNoZXInXSxcbiAgICBbJ3RlaScsICdhcHBsaWNhdGlvbi90ZWkreG1sJ10sXG4gICAgWyd0ZWljb3JwdXMnLCAnYXBwbGljYXRpb24vdGVpK3htbCddLFxuICAgIFsndGV4JywgJ2FwcGxpY2F0aW9uL3gtdGV4J10sXG4gICAgWyd0ZXhpJywgJ2FwcGxpY2F0aW9uL3gtdGV4aW5mbyddLFxuICAgIFsndGV4aW5mbycsICdhcHBsaWNhdGlvbi94LXRleGluZm8nXSxcbiAgICBbJ3RleHQnLCAndGV4dC9wbGFpbiddLFxuICAgIFsndGZpJywgJ2FwcGxpY2F0aW9uL3RocmF1ZCt4bWwnXSxcbiAgICBbJ3RmbScsICdhcHBsaWNhdGlvbi94LXRleC10Zm0nXSxcbiAgICBbJ3RmeCcsICdpbWFnZS90aWZmLWZ4J10sXG4gICAgWyd0Z2EnLCAnaW1hZ2UveC10Z2EnXSxcbiAgICBbJ3RneicsICdhcHBsaWNhdGlvbi94LXRhciddLFxuICAgIFsndGhteCcsICdhcHBsaWNhdGlvbi92bmQubXMtb2ZmaWNldGhlbWUnXSxcbiAgICBbJ3RpZicsICdpbWFnZS90aWZmJ10sXG4gICAgWyd0aWZmJywgJ2ltYWdlL3RpZmYnXSxcbiAgICBbJ3RrJywgJ2FwcGxpY2F0aW9uL3gtdGNsJ10sXG4gICAgWyd0bW8nLCAnYXBwbGljYXRpb24vdm5kLnRtb2JpbGUtbGl2ZXR2J10sXG4gICAgWyd0b21sJywgJ2FwcGxpY2F0aW9uL3RvbWwnXSxcbiAgICBbJ3RvcnJlbnQnLCAnYXBwbGljYXRpb24veC1iaXR0b3JyZW50J10sXG4gICAgWyd0cGwnLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS10b29sLXRlbXBsYXRlJ10sXG4gICAgWyd0cHQnLCAnYXBwbGljYXRpb24vdm5kLnRyaWQudHB0J10sXG4gICAgWyd0cicsICd0ZXh0L3Ryb2ZmJ10sXG4gICAgWyd0cmEnLCAnYXBwbGljYXRpb24vdm5kLnRydWVhcHAnXSxcbiAgICBbJ3RyaWcnLCAnYXBwbGljYXRpb24vdHJpZyddLFxuICAgIFsndHJtJywgJ2FwcGxpY2F0aW9uL3gtbXN0ZXJtaW5hbCddLFxuICAgIFsndHMnLCAndmlkZW8vbXAydCddLFxuICAgIFsndHNkJywgJ2FwcGxpY2F0aW9uL3RpbWVzdGFtcGVkLWRhdGEnXSxcbiAgICBbJ3RzdicsICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ10sXG4gICAgWyd0dGMnLCAnZm9udC9jb2xsZWN0aW9uJ10sXG4gICAgWyd0dGYnLCAnZm9udC90dGYnXSxcbiAgICBbJ3R0bCcsICd0ZXh0L3R1cnRsZSddLFxuICAgIFsndHRtbCcsICdhcHBsaWNhdGlvbi90dG1sK3htbCddLFxuICAgIFsndHdkJywgJ2FwcGxpY2F0aW9uL3ZuZC5zaW10ZWNoLW1pbmRtYXBwZXInXSxcbiAgICBbJ3R3ZHMnLCAnYXBwbGljYXRpb24vdm5kLnNpbXRlY2gtbWluZG1hcHBlciddLFxuICAgIFsndHhkJywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW5vbWF0aXgudHV4ZWRvJ10sXG4gICAgWyd0eGYnLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy50eGYnXSxcbiAgICBbJ3R4dCcsICd0ZXh0L3BsYWluJ10sXG4gICAgWyd1OGRzbicsICdtZXNzYWdlL2dsb2JhbC1kZWxpdmVyeS1zdGF0dXMnXSxcbiAgICBbJ3U4aGRyJywgJ21lc3NhZ2UvZ2xvYmFsLWhlYWRlcnMnXSxcbiAgICBbJ3U4bWRuJywgJ21lc3NhZ2UvZ2xvYmFsLWRpc3Bvc2l0aW9uLW5vdGlmaWNhdGlvbiddLFxuICAgIFsndThtc2cnLCAnbWVzc2FnZS9nbG9iYWwnXSxcbiAgICBbJ3UzMicsICdhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtYmluJ10sXG4gICAgWyd1YmonLCAnYXBwbGljYXRpb24vdWJqc29uJ10sXG4gICAgWyd1ZGViJywgJ2FwcGxpY2F0aW9uL3gtZGViaWFuLXBhY2thZ2UnXSxcbiAgICBbJ3VmZCcsICdhcHBsaWNhdGlvbi92bmQudWZkbCddLFxuICAgIFsndWZkbCcsICdhcHBsaWNhdGlvbi92bmQudWZkbCddLFxuICAgIFsndWx4JywgJ2FwcGxpY2F0aW9uL3gtZ2x1bHgnXSxcbiAgICBbJ3VtaicsICdhcHBsaWNhdGlvbi92bmQudW1hamluJ10sXG4gICAgWyd1bml0eXdlYicsICdhcHBsaWNhdGlvbi92bmQudW5pdHknXSxcbiAgICBbJ3VvbWwnLCAnYXBwbGljYXRpb24vdm5kLnVvbWwreG1sJ10sXG4gICAgWyd1cmknLCAndGV4dC91cmktbGlzdCddLFxuICAgIFsndXJpcycsICd0ZXh0L3VyaS1saXN0J10sXG4gICAgWyd1cmxzJywgJ3RleHQvdXJpLWxpc3QnXSxcbiAgICBbJ3VzZHonLCAnbW9kZWwvdm5kLnVzZHoremlwJ10sXG4gICAgWyd1c3RhcicsICdhcHBsaWNhdGlvbi94LXVzdGFyJ10sXG4gICAgWyd1dHonLCAnYXBwbGljYXRpb24vdm5kLnVpcS50aGVtZSddLFxuICAgIFsndXUnLCAndGV4dC94LXV1ZW5jb2RlJ10sXG4gICAgWyd1dmEnLCAnYXVkaW8vdm5kLmRlY2UuYXVkaW8nXSxcbiAgICBbJ3V2ZCcsICdhcHBsaWNhdGlvbi92bmQuZGVjZS5kYXRhJ10sXG4gICAgWyd1dmYnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UuZGF0YSddLFxuICAgIFsndXZnJywgJ2ltYWdlL3ZuZC5kZWNlLmdyYXBoaWMnXSxcbiAgICBbJ3V2aCcsICd2aWRlby92bmQuZGVjZS5oZCddLFxuICAgIFsndXZpJywgJ2ltYWdlL3ZuZC5kZWNlLmdyYXBoaWMnXSxcbiAgICBbJ3V2bScsICd2aWRlby92bmQuZGVjZS5tb2JpbGUnXSxcbiAgICBbJ3V2cCcsICd2aWRlby92bmQuZGVjZS5wZCddLFxuICAgIFsndXZzJywgJ3ZpZGVvL3ZuZC5kZWNlLnNkJ10sXG4gICAgWyd1dnQnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UudHRtbCt4bWwnXSxcbiAgICBbJ3V2dScsICd2aWRlby92bmQudXZ2dS5tcDQnXSxcbiAgICBbJ3V2dicsICd2aWRlby92bmQuZGVjZS52aWRlbyddLFxuICAgIFsndXZ2YScsICdhdWRpby92bmQuZGVjZS5hdWRpbyddLFxuICAgIFsndXZ2ZCcsICdhcHBsaWNhdGlvbi92bmQuZGVjZS5kYXRhJ10sXG4gICAgWyd1dnZmJywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLmRhdGEnXSxcbiAgICBbJ3V2dmcnLCAnaW1hZ2Uvdm5kLmRlY2UuZ3JhcGhpYyddLFxuICAgIFsndXZ2aCcsICd2aWRlby92bmQuZGVjZS5oZCddLFxuICAgIFsndXZ2aScsICdpbWFnZS92bmQuZGVjZS5ncmFwaGljJ10sXG4gICAgWyd1dnZtJywgJ3ZpZGVvL3ZuZC5kZWNlLm1vYmlsZSddLFxuICAgIFsndXZ2cCcsICd2aWRlby92bmQuZGVjZS5wZCddLFxuICAgIFsndXZ2cycsICd2aWRlby92bmQuZGVjZS5zZCddLFxuICAgIFsndXZ2dCcsICdhcHBsaWNhdGlvbi92bmQuZGVjZS50dG1sK3htbCddLFxuICAgIFsndXZ2dScsICd2aWRlby92bmQudXZ2dS5tcDQnXSxcbiAgICBbJ3V2dnYnLCAndmlkZW8vdm5kLmRlY2UudmlkZW8nXSxcbiAgICBbJ3V2dngnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UudW5zcGVjaWZpZWQnXSxcbiAgICBbJ3V2dnonLCAnYXBwbGljYXRpb24vdm5kLmRlY2UuemlwJ10sXG4gICAgWyd1dngnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UudW5zcGVjaWZpZWQnXSxcbiAgICBbJ3V2eicsICdhcHBsaWNhdGlvbi92bmQuZGVjZS56aXAnXSxcbiAgICBbJ3Zib3gnLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZib3gnXSxcbiAgICBbJ3Zib3gtZXh0cGFjaycsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdmJveC1leHRwYWNrJ10sXG4gICAgWyd2Y2FyZCcsICd0ZXh0L3ZjYXJkJ10sXG4gICAgWyd2Y2QnLCAnYXBwbGljYXRpb24veC1jZGxpbmsnXSxcbiAgICBbJ3ZjZicsICd0ZXh0L3gtdmNhcmQnXSxcbiAgICBbJ3ZjZycsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXZjYXJkJ10sXG4gICAgWyd2Y3MnLCAndGV4dC94LXZjYWxlbmRhciddLFxuICAgIFsndmN4JywgJ2FwcGxpY2F0aW9uL3ZuZC52Y3gnXSxcbiAgICBbJ3ZkaScsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdmRpJ10sXG4gICAgWyd2ZHMnLCAnbW9kZWwvdm5kLnNhcC52ZHMnXSxcbiAgICBbJ3ZoZCcsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdmhkJ10sXG4gICAgWyd2aXMnLCAnYXBwbGljYXRpb24vdm5kLnZpc2lvbmFyeSddLFxuICAgIFsndml2JywgJ3ZpZGVvL3ZuZC52aXZvJ10sXG4gICAgWyd2bGMnLCAnYXBwbGljYXRpb24vdmlkZW9sYW4nXSxcbiAgICBbJ3ZtZGsnLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZtZGsnXSxcbiAgICBbJ3ZvYicsICd2aWRlby94LW1zLXZvYiddLFxuICAgIFsndm9yJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24ud3JpdGVyJ10sXG4gICAgWyd2b3gnLCAnYXBwbGljYXRpb24veC1hdXRob3J3YXJlLWJpbiddLFxuICAgIFsndnJtbCcsICdtb2RlbC92cm1sJ10sXG4gICAgWyd2c2QnLCAnYXBwbGljYXRpb24vdm5kLnZpc2lvJ10sXG4gICAgWyd2c2YnLCAnYXBwbGljYXRpb24vdm5kLnZzZiddLFxuICAgIFsndnNzJywgJ2FwcGxpY2F0aW9uL3ZuZC52aXNpbyddLFxuICAgIFsndnN0JywgJ2FwcGxpY2F0aW9uL3ZuZC52aXNpbyddLFxuICAgIFsndnN3JywgJ2FwcGxpY2F0aW9uL3ZuZC52aXNpbyddLFxuICAgIFsndnRmJywgJ2ltYWdlL3ZuZC52YWx2ZS5zb3VyY2UudGV4dHVyZSddLFxuICAgIFsndnR0JywgJ3RleHQvdnR0J10sXG4gICAgWyd2dHUnLCAnbW9kZWwvdm5kLnZ0dSddLFxuICAgIFsndnhtbCcsICdhcHBsaWNhdGlvbi92b2ljZXhtbCt4bWwnXSxcbiAgICBbJ3czZCcsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWyd3YWQnLCAnYXBwbGljYXRpb24veC1kb29tJ10sXG4gICAgWyd3YWRsJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ud2FkbCt4bWwnXSxcbiAgICBbJ3dhcicsICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnXSxcbiAgICBbJ3dhc20nLCAnYXBwbGljYXRpb24vd2FzbSddLFxuICAgIFsnd2F2JywgJ2F1ZGlvL3gtd2F2J10sXG4gICAgWyd3YXgnLCAnYXVkaW8veC1tcy13YXgnXSxcbiAgICBbJ3dibXAnLCAnaW1hZ2Uvdm5kLndhcC53Ym1wJ10sXG4gICAgWyd3YnMnLCAnYXBwbGljYXRpb24vdm5kLmNyaXRpY2FsdG9vbHMud2JzK3htbCddLFxuICAgIFsnd2J4bWwnLCAnYXBwbGljYXRpb24vd2J4bWwnXSxcbiAgICBbJ3djbScsICdhcHBsaWNhdGlvbi92bmQubXMtd29ya3MnXSxcbiAgICBbJ3dkYicsICdhcHBsaWNhdGlvbi92bmQubXMtd29ya3MnXSxcbiAgICBbJ3dkcCcsICdpbWFnZS92bmQubXMtcGhvdG8nXSxcbiAgICBbJ3dlYmEnLCAnYXVkaW8vd2VibSddLFxuICAgIFsnd2ViYXBwJywgJ2FwcGxpY2F0aW9uL3gtd2ViLWFwcC1tYW5pZmVzdCtqc29uJ10sXG4gICAgWyd3ZWJtJywgJ3ZpZGVvL3dlYm0nXSxcbiAgICBbJ3dlYm1hbmlmZXN0JywgJ2FwcGxpY2F0aW9uL21hbmlmZXN0K2pzb24nXSxcbiAgICBbJ3dlYnAnLCAnaW1hZ2Uvd2VicCddLFxuICAgIFsnd2cnLCAnYXBwbGljYXRpb24vdm5kLnBtaS53aWRnZXQnXSxcbiAgICBbJ3dndCcsICdhcHBsaWNhdGlvbi93aWRnZXQnXSxcbiAgICBbJ3drcycsICdhcHBsaWNhdGlvbi92bmQubXMtd29ya3MnXSxcbiAgICBbJ3dtJywgJ3ZpZGVvL3gtbXMtd20nXSxcbiAgICBbJ3dtYScsICdhdWRpby94LW1zLXdtYSddLFxuICAgIFsnd21kJywgJ2FwcGxpY2F0aW9uL3gtbXMtd21kJ10sXG4gICAgWyd3bWYnLCAnaW1hZ2Uvd21mJ10sXG4gICAgWyd3bWwnLCAndGV4dC92bmQud2FwLndtbCddLFxuICAgIFsnd21sYycsICdhcHBsaWNhdGlvbi93bWxjJ10sXG4gICAgWyd3bWxzJywgJ3RleHQvdm5kLndhcC53bWxzY3JpcHQnXSxcbiAgICBbJ3dtbHNjJywgJ2FwcGxpY2F0aW9uL3ZuZC53YXAud21sc2NyaXB0YyddLFxuICAgIFsnd212JywgJ3ZpZGVvL3gtbXMtd212J10sXG4gICAgWyd3bXgnLCAndmlkZW8veC1tcy13bXgnXSxcbiAgICBbJ3dteicsICdhcHBsaWNhdGlvbi94LW1zbWV0YWZpbGUnXSxcbiAgICBbJ3dvZmYnLCAnZm9udC93b2ZmJ10sXG4gICAgWyd3b2ZmMicsICdmb250L3dvZmYyJ10sXG4gICAgWyd3b3JkJywgJ2FwcGxpY2F0aW9uL21zd29yZCddLFxuICAgIFsnd3BkJywgJ2FwcGxpY2F0aW9uL3ZuZC53b3JkcGVyZmVjdCddLFxuICAgIFsnd3BsJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13cGwnXSxcbiAgICBbJ3dwcycsICdhcHBsaWNhdGlvbi92bmQubXMtd29ya3MnXSxcbiAgICBbJ3dxZCcsICdhcHBsaWNhdGlvbi92bmQud3FkJ10sXG4gICAgWyd3cmknLCAnYXBwbGljYXRpb24veC1tc3dyaXRlJ10sXG4gICAgWyd3cmwnLCAnbW9kZWwvdnJtbCddLFxuICAgIFsnd3NjJywgJ21lc3NhZ2Uvdm5kLndmYS53c2MnXSxcbiAgICBbJ3dzZGwnLCAnYXBwbGljYXRpb24vd3NkbCt4bWwnXSxcbiAgICBbJ3dzcG9saWN5JywgJ2FwcGxpY2F0aW9uL3dzcG9saWN5K3htbCddLFxuICAgIFsnd3RiJywgJ2FwcGxpY2F0aW9uL3ZuZC53ZWJ0dXJibyddLFxuICAgIFsnd3Z4JywgJ3ZpZGVvL3gtbXMtd3Z4J10sXG4gICAgWyd4M2QnLCAnbW9kZWwveDNkK3htbCddLFxuICAgIFsneDNkYicsICdtb2RlbC94M2QrZmFzdGluZm9zZXQnXSxcbiAgICBbJ3gzZGJ6JywgJ21vZGVsL3gzZCtiaW5hcnknXSxcbiAgICBbJ3gzZHYnLCAnbW9kZWwveDNkLXZybWwnXSxcbiAgICBbJ3gzZHZ6JywgJ21vZGVsL3gzZCt2cm1sJ10sXG4gICAgWyd4M2R6JywgJ21vZGVsL3gzZCt4bWwnXSxcbiAgICBbJ3gzMicsICdhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtYmluJ10sXG4gICAgWyd4X2InLCAnbW9kZWwvdm5kLnBhcmFzb2xpZC50cmFuc21pdC5iaW5hcnknXSxcbiAgICBbJ3hfdCcsICdtb2RlbC92bmQucGFyYXNvbGlkLnRyYW5zbWl0LnRleHQnXSxcbiAgICBbJ3hhbWwnLCAnYXBwbGljYXRpb24veGFtbCt4bWwnXSxcbiAgICBbJ3hhcCcsICdhcHBsaWNhdGlvbi94LXNpbHZlcmxpZ2h0LWFwcCddLFxuICAgIFsneGFyJywgJ2FwcGxpY2F0aW9uL3ZuZC54YXJhJ10sXG4gICAgWyd4YXYnLCAnYXBwbGljYXRpb24veGNhcC1hdHQreG1sJ10sXG4gICAgWyd4YmFwJywgJ2FwcGxpY2F0aW9uL3gtbXMteGJhcCddLFxuICAgIFsneGJkJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZG9jdXdvcmtzLmJpbmRlciddLFxuICAgIFsneGJtJywgJ2ltYWdlL3gteGJpdG1hcCddLFxuICAgIFsneGNhJywgJ2FwcGxpY2F0aW9uL3hjYXAtY2Fwcyt4bWwnXSxcbiAgICBbJ3hjcycsICdhcHBsaWNhdGlvbi9jYWxlbmRhcit4bWwnXSxcbiAgICBbJ3hkZicsICdhcHBsaWNhdGlvbi94Y2FwLWRpZmYreG1sJ10sXG4gICAgWyd4ZG0nLCAnYXBwbGljYXRpb24vdm5kLnN5bmNtbC5kbSt4bWwnXSxcbiAgICBbJ3hkcCcsICdhcHBsaWNhdGlvbi92bmQuYWRvYmUueGRwK3htbCddLFxuICAgIFsneGRzc2MnLCAnYXBwbGljYXRpb24vZHNzYyt4bWwnXSxcbiAgICBbJ3hkdycsICdhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRvY3V3b3JrcyddLFxuICAgIFsneGVsJywgJ2FwcGxpY2F0aW9uL3hjYXAtZWwreG1sJ10sXG4gICAgWyd4ZW5jJywgJ2FwcGxpY2F0aW9uL3hlbmMreG1sJ10sXG4gICAgWyd4ZXInLCAnYXBwbGljYXRpb24vcGF0Y2gtb3BzLWVycm9yK3htbCddLFxuICAgIFsneGZkZicsICdhcHBsaWNhdGlvbi92bmQuYWRvYmUueGZkZiddLFxuICAgIFsneGZkbCcsICdhcHBsaWNhdGlvbi92bmQueGZkbCddLFxuICAgIFsneGh0JywgJ2FwcGxpY2F0aW9uL3hodG1sK3htbCddLFxuICAgIFsneGh0bWwnLCAnYXBwbGljYXRpb24veGh0bWwreG1sJ10sXG4gICAgWyd4aHZtbCcsICdhcHBsaWNhdGlvbi94dit4bWwnXSxcbiAgICBbJ3hpZicsICdpbWFnZS92bmQueGlmZiddLFxuICAgIFsneGwnLCAnYXBwbGljYXRpb24vZXhjZWwnXSxcbiAgICBbJ3hsYScsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3hsYW0nLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLmFkZGluLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsneGxjJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCddLFxuICAgIFsneGxmJywgJ2FwcGxpY2F0aW9uL3hsaWZmK3htbCddLFxuICAgIFsneGxtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCddLFxuICAgIFsneGxzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCddLFxuICAgIFsneGxzYicsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQuYmluYXJ5Lm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsneGxzbScsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWyd4bHN4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0J10sXG4gICAgWyd4bHQnLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ10sXG4gICAgWyd4bHRtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC50ZW1wbGF0ZS5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3hsdHgnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwudGVtcGxhdGUnXSxcbiAgICBbJ3hsdycsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3htJywgJ2F1ZGlvL3htJ10sXG4gICAgWyd4bWwnLCAnYXBwbGljYXRpb24veG1sJ10sXG4gICAgWyd4bnMnLCAnYXBwbGljYXRpb24veGNhcC1ucyt4bWwnXSxcbiAgICBbJ3hvJywgJ2FwcGxpY2F0aW9uL3ZuZC5vbHBjLXN1Z2FyJ10sXG4gICAgWyd4b3AnLCAnYXBwbGljYXRpb24veG9wK3htbCddLFxuICAgIFsneHBpJywgJ2FwcGxpY2F0aW9uL3gteHBpbnN0YWxsJ10sXG4gICAgWyd4cGwnLCAnYXBwbGljYXRpb24veHByb2MreG1sJ10sXG4gICAgWyd4cG0nLCAnaW1hZ2UveC14cGl4bWFwJ10sXG4gICAgWyd4cHInLCAnYXBwbGljYXRpb24vdm5kLmlzLXhwciddLFxuICAgIFsneHBzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy14cHNkb2N1bWVudCddLFxuICAgIFsneHB3JywgJ2FwcGxpY2F0aW9uL3ZuZC5pbnRlcmNvbi5mb3JtbmV0J10sXG4gICAgWyd4cHgnLCAnYXBwbGljYXRpb24vdm5kLmludGVyY29uLmZvcm1uZXQnXSxcbiAgICBbJ3hzZCcsICdhcHBsaWNhdGlvbi94bWwnXSxcbiAgICBbJ3hzbCcsICdhcHBsaWNhdGlvbi94bWwnXSxcbiAgICBbJ3hzbHQnLCAnYXBwbGljYXRpb24veHNsdCt4bWwnXSxcbiAgICBbJ3hzbScsICdhcHBsaWNhdGlvbi92bmQuc3luY21sK3htbCddLFxuICAgIFsneHNwZicsICdhcHBsaWNhdGlvbi94c3BmK3htbCddLFxuICAgIFsneHVsJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb3ppbGxhLnh1bCt4bWwnXSxcbiAgICBbJ3h2bScsICdhcHBsaWNhdGlvbi94dit4bWwnXSxcbiAgICBbJ3h2bWwnLCAnYXBwbGljYXRpb24veHYreG1sJ10sXG4gICAgWyd4d2QnLCAnaW1hZ2UveC14d2luZG93ZHVtcCddLFxuICAgIFsneHl6JywgJ2NoZW1pY2FsL3gteHl6J10sXG4gICAgWyd4eicsICdhcHBsaWNhdGlvbi94LXh6J10sXG4gICAgWyd5YW1sJywgJ3RleHQveWFtbCddLFxuICAgIFsneWFuZycsICdhcHBsaWNhdGlvbi95YW5nJ10sXG4gICAgWyd5aW4nLCAnYXBwbGljYXRpb24veWluK3htbCddLFxuICAgIFsneW1sJywgJ3RleHQveWFtbCddLFxuICAgIFsneW1wJywgJ3RleHQveC1zdXNlLXltcCddLFxuICAgIFsneicsICdhcHBsaWNhdGlvbi94LWNvbXByZXNzJ10sXG4gICAgWyd6MScsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6MicsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6MycsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6NCcsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6NScsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6NicsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6NycsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6OCcsICdhcHBsaWNhdGlvbi94LXptYWNoaW5lJ10sXG4gICAgWyd6YXonLCAnYXBwbGljYXRpb24vdm5kLnp6YXp6LmRlY2sreG1sJ10sXG4gICAgWyd6aXAnLCAnYXBwbGljYXRpb24vemlwJ10sXG4gICAgWyd6aXInLCAnYXBwbGljYXRpb24vdm5kLnp1bCddLFxuICAgIFsnemlyeicsICdhcHBsaWNhdGlvbi92bmQuenVsJ10sXG4gICAgWyd6bW0nLCAnYXBwbGljYXRpb24vdm5kLmhhbmRoZWxkLWVudGVydGFpbm1lbnQreG1sJ10sXG4gICAgWyd6c2gnLCAndGV4dC94LXNjcmlwdHpzaCddXG5dKTtcbmZ1bmN0aW9uIHRvRmlsZVdpdGhQYXRoKGZpbGUsIHBhdGgsIGgpIHtcbiAgICB2YXIgZiA9IHdpdGhNaW1lVHlwZShmaWxlKTtcbiAgICB2YXIgd2Via2l0UmVsYXRpdmVQYXRoID0gZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGg7XG4gICAgdmFyIHAgPSB0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBwYXRoXG4gICAgICAgIC8vIElmIDxpbnB1dCB3ZWJraXRkaXJlY3Rvcnk+IGlzIHNldCxcbiAgICAgICAgLy8gdGhlIEZpbGUgd2lsbCBoYXZlIGEge3dlYmtpdFJlbGF0aXZlUGF0aH0gcHJvcGVydHlcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxJbnB1dEVsZW1lbnQvd2Via2l0ZGlyZWN0b3J5XG4gICAgICAgIDogdHlwZW9mIHdlYmtpdFJlbGF0aXZlUGF0aCA9PT0gJ3N0cmluZycgJiYgd2Via2l0UmVsYXRpdmVQYXRoLmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gd2Via2l0UmVsYXRpdmVQYXRoXG4gICAgICAgICAgICA6IFwiLi9cIi5jb25jYXQoZmlsZS5uYW1lKTtcbiAgICBpZiAodHlwZW9mIGYucGF0aCAhPT0gJ3N0cmluZycpIHsgLy8gb24gZWxlY3Ryb24sIHBhdGggaXMgYWxyZWFkeSBzZXQgdG8gdGhlIGFic29sdXRlIHBhdGhcbiAgICAgICAgc2V0T2JqUHJvcChmLCAncGF0aCcsIHApO1xuICAgIH1cbiAgICBpZiAoaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCAnaGFuZGxlJywge1xuICAgICAgICAgICAgdmFsdWU6IGgsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gQWx3YXlzIHBvcHVsYXRlIGEgcmVsYXRpdmUgcGF0aCBzbyB0aGF0IGV2ZW4gZWxlY3Ryb24gYXBwcyBoYXZlIGFjY2VzcyB0byBhIHJlbGF0aXZlUGF0aCB2YWx1ZVxuICAgIHNldE9ialByb3AoZiwgJ3JlbGF0aXZlUGF0aCcsIHApO1xuICAgIHJldHVybiBmO1xufVxuZnVuY3Rpb24gd2l0aE1pbWVUeXBlKGZpbGUpIHtcbiAgICB2YXIgbmFtZSA9IGZpbGUubmFtZTtcbiAgICB2YXIgaGFzRXh0ZW5zaW9uID0gbmFtZSAmJiBuYW1lLmxhc3RJbmRleE9mKCcuJykgIT09IC0xO1xuICAgIGlmIChoYXNFeHRlbnNpb24gJiYgIWZpbGUudHlwZSkge1xuICAgICAgICB2YXIgZXh0ID0gbmFtZS5zcGxpdCgnLicpXG4gICAgICAgICAgICAucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdmFyIHR5cGUgPSBleHBvcnRzLkNPTU1PTl9NSU1FX1RZUEVTLmdldChleHQpO1xuICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZpbGUsICd0eXBlJywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB0eXBlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWxlO1xufVxuZnVuY3Rpb24gc2V0T2JqUHJvcChmLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEl0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKTtcbiAgICByZXR1cm4gZy5uZXh0ID0gdmVyYigwKSwgZ1tcInRocm93XCJdID0gdmVyYigxKSwgZ1tcInJldHVyblwiXSA9IHZlcmIoMiksIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyb21FdmVudCA9IGZyb21FdmVudDtcbnZhciBmaWxlXzEgPSByZXF1aXJlKFwiLi9maWxlXCIpO1xudmFyIEZJTEVTX1RPX0lHTk9SRSA9IFtcbiAgICAvLyBUaHVtYm5haWwgY2FjaGUgZmlsZXMgZm9yIG1hY09TIGFuZCBXaW5kb3dzXG4gICAgJy5EU19TdG9yZScsIC8vIG1hY09zXG4gICAgJ1RodW1icy5kYicgLy8gV2luZG93c1xuXTtcbi8qKlxuICogQ29udmVydCBhIERyYWdFdmVudCdzIERhdGFUcmFzZmVyIG9iamVjdCB0byBhIGxpc3Qgb2YgRmlsZSBvYmplY3RzXG4gKiBOT1RFOiBJZiBzb21lIG9mIHRoZSBpdGVtcyBhcmUgZm9sZGVycyxcbiAqIGV2ZXJ5dGhpbmcgd2lsbCBiZSBmbGF0dGVuZWQgYW5kIHBsYWNlZCBpbiB0aGUgc2FtZSBsaXN0IGJ1dCB0aGUgcGF0aHMgd2lsbCBiZSBrZXB0IGFzIGEge3BhdGh9IHByb3BlcnR5LlxuICpcbiAqIEVYUEVSSU1FTlRBTDogQSBsaXN0IG9mIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtSGFuZGxlIG9iamVjdHMgY2FuIGFsc28gYmUgcGFzc2VkIGFzIGFuIGFyZ1xuICogYW5kIGEgbGlzdCBvZiBGaWxlIG9iamVjdHMgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gZXZ0XG4gKi9cbmZ1bmN0aW9uIGZyb21FdmVudChldnQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIGlmIChpc09iamVjdChldnQpICYmIGlzRGF0YVRyYW5zZmVyKGV2dC5kYXRhVHJhbnNmZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGdldERhdGFUcmFuc2ZlckZpbGVzKGV2dC5kYXRhVHJhbnNmZXIsIGV2dC50eXBlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0NoYW5nZUV2dChldnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGdldElucHV0RmlsZXMoZXZ0KV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGV2dCkgJiYgZXZ0LmV2ZXJ5KGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAnZ2V0RmlsZScgaW4gaXRlbSAmJiB0eXBlb2YgaXRlbS5nZXRGaWxlID09PSAnZnVuY3Rpb24nOyB9KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBnZXRGc0hhbmRsZUZpbGVzKGV2dCldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFtdXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpc0RhdGFUcmFuc2Zlcih2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSk7XG59XG5mdW5jdGlvbiBpc0NoYW5nZUV2dCh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgaXNPYmplY3QodmFsdWUudGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KHYpIHtcbiAgICByZXR1cm4gdHlwZW9mIHYgPT09ICdvYmplY3QnICYmIHYgIT09IG51bGw7XG59XG5mdW5jdGlvbiBnZXRJbnB1dEZpbGVzKGV2dCkge1xuICAgIHJldHVybiBmcm9tTGlzdChldnQudGFyZ2V0LmZpbGVzKS5tYXAoZnVuY3Rpb24gKGZpbGUpIHsgcmV0dXJuICgwLCBmaWxlXzEudG9GaWxlV2l0aFBhdGgpKGZpbGUpOyB9KTtcbn1cbi8vIEVlIGV4cGVjdCBlYWNoIGhhbmRsZSB0byBiZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbUZpbGVIYW5kbGVcbmZ1bmN0aW9uIGdldEZzSGFuZGxlRmlsZXMoaGFuZGxlcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZpbGVzO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChoYW5kbGVzLm1hcChmdW5jdGlvbiAoaCkgeyByZXR1cm4gaC5nZXRGaWxlKCk7IH0pKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGZpbGVzLm1hcChmdW5jdGlvbiAoZmlsZSkgeyByZXR1cm4gKDAsIGZpbGVfMS50b0ZpbGVXaXRoUGF0aCkoZmlsZSk7IH0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXREYXRhVHJhbnNmZXJGaWxlcyhkdCwgdHlwZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZW1zLCBmaWxlcztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkdC5pdGVtcykgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gZnJvbUxpc3QoZHQuaXRlbXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLmtpbmQgPT09ICdmaWxlJzsgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFjY29yZGluZyB0byBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9kbmQuaHRtbCNkbmRldmVudHMsXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgJ2RyYWdzdGFydCcgYW5kICdkcm9wJyBoYXMgYWNjZXNzIHRvIHRoZSBkYXRhIChzb3VyY2Ugbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgIT09ICdkcm9wJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGl0ZW1zXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChpdGVtcy5tYXAodG9GaWxlUHJvbWlzZXMpKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5vSWdub3JlZEZpbGVzKGZsYXR0ZW4oZmlsZXMpKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIgLypyZXR1cm4qLywgbm9JZ25vcmVkRmlsZXMoZnJvbUxpc3QoZHQuZmlsZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChmaWxlKSB7IHJldHVybiAoMCwgZmlsZV8xLnRvRmlsZVdpdGhQYXRoKShmaWxlKTsgfSkpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBub0lnbm9yZWRGaWxlcyhmaWxlcykge1xuICAgIHJldHVybiBmaWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHsgcmV0dXJuIEZJTEVTX1RPX0lHTk9SRS5pbmRleE9mKGZpbGUubmFtZSkgPT09IC0xOyB9KTtcbn1cbi8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCBBcnJheS5mcm9tKClcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2Zyb20jQnJvd3Nlcl9jb21wYXRpYmlsaXR5XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZUxpc3Rcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EYXRhVHJhbnNmZXJJdGVtTGlzdFxuZnVuY3Rpb24gZnJvbUxpc3QoaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB2YXIgZmlsZXMgPSBbXTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTogcHJlZmVyLWZvci1vZlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGZpbGUgPSBpdGVtc1tpXTtcbiAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVzO1xufVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RhdGFUcmFuc2Zlckl0ZW1cbmZ1bmN0aW9uIHRvRmlsZVByb21pc2VzKGl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0ud2Via2l0R2V0QXNFbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gZnJvbURhdGFUcmFuc2Zlckl0ZW0oaXRlbSk7XG4gICAgfVxuICAgIHZhciBlbnRyeSA9IGl0ZW0ud2Via2l0R2V0QXNFbnRyeSgpO1xuICAgIC8vIFNhZmFyaSBzdXBwb3J0cyBkcm9wcGluZyBhbiBpbWFnZSBub2RlIGZyb20gYSBkaWZmZXJlbnQgd2luZG93IGFuZCBjYW4gYmUgcmV0cmlldmVkIHVzaW5nXG4gICAgLy8gdGhlIERhdGFUcmFuc2Zlckl0ZW0uZ2V0QXNGaWxlKCkgQVBJXG4gICAgLy8gTk9URTogRmlsZVN5c3RlbUVudHJ5LmZpbGUoKSB0aHJvd3MgaWYgdHJ5aW5nIHRvIGdldCB0aGUgZmlsZVxuICAgIGlmIChlbnRyeSAmJiBlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgICByZXR1cm4gZnJvbURpckVudHJ5KGVudHJ5KTtcbiAgICB9XG4gICAgcmV0dXJuIGZyb21EYXRhVHJhbnNmZXJJdGVtKGl0ZW0sIGVudHJ5KTtcbn1cbmZ1bmN0aW9uIGZsYXR0ZW4oaXRlbXMpIHtcbiAgICByZXR1cm4gaXRlbXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGZpbGVzKSB7IHJldHVybiBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhY2MpLCBmYWxzZSksIF9fcmVhZCgoQXJyYXkuaXNBcnJheShmaWxlcykgPyBmbGF0dGVuKGZpbGVzKSA6IFtmaWxlc10pKSwgZmFsc2UpOyB9LCBbXSk7XG59XG5mdW5jdGlvbiBmcm9tRGF0YVRyYW5zZmVySXRlbShpdGVtLCBlbnRyeSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGgsIGZpbGVfMiwgZmlsZSwgZndwO1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGdsb2JhbFRoaXMuaXNTZWN1cmVDb250ZXh0ICYmIHR5cGVvZiBpdGVtLmdldEFzRmlsZVN5c3RlbUhhbmRsZSA9PT0gJ2Z1bmN0aW9uJykpIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBpdGVtLmdldEFzRmlsZVN5c3RlbUhhbmRsZSgpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGggPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIi5jb25jYXQoaXRlbSwgXCIgaXMgbm90IGEgRmlsZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoaCAhPT0gdW5kZWZpbmVkKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGguZ2V0RmlsZSgpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGZpbGVfMiA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsZV8yLmhhbmRsZSA9IGg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCAoMCwgZmlsZV8xLnRvRmlsZVdpdGhQYXRoKShmaWxlXzIpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlwiLmNvbmNhdChpdGVtLCBcIiBpcyBub3QgYSBGaWxlXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmd3AgPSAoMCwgZmlsZV8xLnRvRmlsZVdpdGhQYXRoKShmaWxlLCAoX2EgPSBlbnRyeSA9PT0gbnVsbCB8fCBlbnRyeSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZW50cnkuZnVsbFBhdGgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBmd3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRW50cnlcbmZ1bmN0aW9uIGZyb21FbnRyeShlbnRyeSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGVudHJ5LmlzRGlyZWN0b3J5ID8gZnJvbURpckVudHJ5KGVudHJ5KSA6IGZyb21GaWxlRW50cnkoZW50cnkpXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbURpcmVjdG9yeUVudHJ5XG5mdW5jdGlvbiBmcm9tRGlyRW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVhZGVyID0gZW50cnkuY3JlYXRlUmVhZGVyKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcmVhZEVudHJpZXMoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1EaXJlY3RvcnlFbnRyeS9jcmVhdGVSZWFkZXJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRGlyZWN0b3J5UmVhZGVyL3JlYWRFbnRyaWVzXG4gICAgICAgICAgICByZWFkZXIucmVhZEVudHJpZXMoZnVuY3Rpb24gKGJhdGNoKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVzLCBlcnJfMSwgaXRlbXM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhYmF0Y2gubGVuZ3RoKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChlbnRyaWVzKV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycl8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBQcm9taXNlLmFsbChiYXRjaC5tYXAoZnJvbUVudHJ5KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSByZWFkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZEVudHJpZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDY6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgfSk7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbUZpbGVFbnRyeVxuZnVuY3Rpb24gZnJvbUZpbGVFbnRyeShlbnRyeSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ3cCA9ICgwLCBmaWxlXzEudG9GaWxlV2l0aFBhdGgpKGZpbGUsIGVudHJ5LmZ1bGxQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZndwKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxlLXNlbGVjdG9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5mcm9tRXZlbnQgPSB2b2lkIDA7XG52YXIgZmlsZV9zZWxlY3Rvcl8xID0gcmVxdWlyZShcIi4vZmlsZS1zZWxlY3RvclwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImZyb21FdmVudFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZmlsZV9zZWxlY3Rvcl8xLmZyb21FdmVudDsgfSB9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGUpe3ZhciByPXt9O2Z1bmN0aW9uIHQobil7aWYocltuXSlyZXR1cm4gcltuXS5leHBvcnRzO3ZhciBvPXJbbl09e2k6bixsOiExLGV4cG9ydHM6e319O3JldHVybiBlW25dLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLHQpLG8ubD0hMCxvLmV4cG9ydHN9cmV0dXJuIHQubT1lLHQuYz1yLHQuZD1mdW5jdGlvbihlLHIsbil7dC5vKGUscil8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHIse2VudW1lcmFibGU6ITAsZ2V0Om59KX0sdC5yPWZ1bmN0aW9uKGUpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC50b1N0cmluZ1RhZyYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZTpcIk1vZHVsZVwifSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9LHQudD1mdW5jdGlvbihlLHIpe2lmKDEmciYmKGU9dChlKSksOCZyKXJldHVybiBlO2lmKDQmciYmXCJvYmplY3RcIj09dHlwZW9mIGUmJmUmJmUuX19lc01vZHVsZSlyZXR1cm4gZTt2YXIgbj1PYmplY3QuY3JlYXRlKG51bGwpO2lmKHQucihuKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcImRlZmF1bHRcIix7ZW51bWVyYWJsZTohMCx2YWx1ZTplfSksMiZyJiZcInN0cmluZ1wiIT10eXBlb2YgZSlmb3IodmFyIG8gaW4gZSl0LmQobixvLGZ1bmN0aW9uKHIpe3JldHVybiBlW3JdfS5iaW5kKG51bGwsbykpO3JldHVybiBufSx0Lm49ZnVuY3Rpb24oZSl7dmFyIHI9ZSYmZS5fX2VzTW9kdWxlP2Z1bmN0aW9uKCl7cmV0dXJuIGUuZGVmYXVsdH06ZnVuY3Rpb24oKXtyZXR1cm4gZX07cmV0dXJuIHQuZChyLFwiYVwiLHIpLHJ9LHQubz1mdW5jdGlvbihlLHIpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxyKX0sdC5wPVwiXCIsdCh0LnM9MCl9KFtmdW5jdGlvbihlLHIsdCl7XCJ1c2Ugc3RyaWN0XCI7ci5fX2VzTW9kdWxlPSEwLHIuZGVmYXVsdD1mdW5jdGlvbihlLHIpe2lmKGUmJnIpe3ZhciB0PUFycmF5LmlzQXJyYXkocik/cjpyLnNwbGl0KFwiLFwiKTtpZigwPT09dC5sZW5ndGgpcmV0dXJuITA7dmFyIG49ZS5uYW1lfHxcIlwiLG89KGUudHlwZXx8XCJcIikudG9Mb3dlckNhc2UoKSx1PW8ucmVwbGFjZSgvXFwvLiokLyxcIlwiKTtyZXR1cm4gdC5zb21lKChmdW5jdGlvbihlKXt2YXIgcj1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpO3JldHVyblwiLlwiPT09ci5jaGFyQXQoMCk/bi50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKHIpOnIuZW5kc1dpdGgoXCIvKlwiKT91PT09ci5yZXBsYWNlKC9cXC8uKiQvLFwiXCIpOm89PT1yfSkpfXJldHVybiEwfX1dKTsiLCJmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gbnVsbCAhPSBhcmd1bWVudHNbaV0gPyBhcmd1bWVudHNbaV0gOiB7fTsgaSAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSA6IG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfSwgX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuaW1wb3J0IF9hY2NlcHRzIGZyb20gXCJhdHRyLWFjY2VwdFwiO1xudmFyIGFjY2VwdHMgPSB0eXBlb2YgX2FjY2VwdHMgPT09IFwiZnVuY3Rpb25cIiA/IF9hY2NlcHRzIDogX2FjY2VwdHMuZGVmYXVsdDsgLy8gRXJyb3IgY29kZXNcblxuZXhwb3J0IHZhciBGSUxFX0lOVkFMSURfVFlQRSA9IFwiZmlsZS1pbnZhbGlkLXR5cGVcIjtcbmV4cG9ydCB2YXIgRklMRV9UT09fTEFSR0UgPSBcImZpbGUtdG9vLWxhcmdlXCI7XG5leHBvcnQgdmFyIEZJTEVfVE9PX1NNQUxMID0gXCJmaWxlLXRvby1zbWFsbFwiO1xuZXhwb3J0IHZhciBUT09fTUFOWV9GSUxFUyA9IFwidG9vLW1hbnktZmlsZXNcIjtcbmV4cG9ydCB2YXIgRXJyb3JDb2RlID0ge1xuICBGaWxlSW52YWxpZFR5cGU6IEZJTEVfSU5WQUxJRF9UWVBFLFxuICBGaWxlVG9vTGFyZ2U6IEZJTEVfVE9PX0xBUkdFLFxuICBGaWxlVG9vU21hbGw6IEZJTEVfVE9PX1NNQUxMLFxuICBUb29NYW55RmlsZXM6IFRPT19NQU5ZX0ZJTEVTXG59O1xuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGFjY2VwdFxuICovXG5cbmV4cG9ydCB2YXIgZ2V0SW52YWxpZFR5cGVSZWplY3Rpb25FcnIgPSBmdW5jdGlvbiBnZXRJbnZhbGlkVHlwZVJlamVjdGlvbkVycigpIHtcbiAgdmFyIGFjY2VwdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogXCJcIjtcbiAgdmFyIGFjY2VwdEFyciA9IGFjY2VwdC5zcGxpdChcIixcIik7XG4gIHZhciBtc2cgPSBhY2NlcHRBcnIubGVuZ3RoID4gMSA/IFwib25lIG9mIFwiLmNvbmNhdChhY2NlcHRBcnIuam9pbihcIiwgXCIpKSA6IGFjY2VwdEFyclswXTtcbiAgcmV0dXJuIHtcbiAgICBjb2RlOiBGSUxFX0lOVkFMSURfVFlQRSxcbiAgICBtZXNzYWdlOiBcIkZpbGUgdHlwZSBtdXN0IGJlIFwiLmNvbmNhdChtc2cpXG4gIH07XG59O1xuZXhwb3J0IHZhciBnZXRUb29MYXJnZVJlamVjdGlvbkVyciA9IGZ1bmN0aW9uIGdldFRvb0xhcmdlUmVqZWN0aW9uRXJyKG1heFNpemUpIHtcbiAgcmV0dXJuIHtcbiAgICBjb2RlOiBGSUxFX1RPT19MQVJHRSxcbiAgICBtZXNzYWdlOiBcIkZpbGUgaXMgbGFyZ2VyIHRoYW4gXCIuY29uY2F0KG1heFNpemUsIFwiIFwiKS5jb25jYXQobWF4U2l6ZSA9PT0gMSA/IFwiYnl0ZVwiIDogXCJieXRlc1wiKVxuICB9O1xufTtcbmV4cG9ydCB2YXIgZ2V0VG9vU21hbGxSZWplY3Rpb25FcnIgPSBmdW5jdGlvbiBnZXRUb29TbWFsbFJlamVjdGlvbkVycihtaW5TaXplKSB7XG4gIHJldHVybiB7XG4gICAgY29kZTogRklMRV9UT09fU01BTEwsXG4gICAgbWVzc2FnZTogXCJGaWxlIGlzIHNtYWxsZXIgdGhhbiBcIi5jb25jYXQobWluU2l6ZSwgXCIgXCIpLmNvbmNhdChtaW5TaXplID09PSAxID8gXCJieXRlXCIgOiBcImJ5dGVzXCIpXG4gIH07XG59O1xuZXhwb3J0IHZhciBUT09fTUFOWV9GSUxFU19SRUpFQ1RJT04gPSB7XG4gIGNvZGU6IFRPT19NQU5ZX0ZJTEVTLFxuICBtZXNzYWdlOiBcIlRvbyBtYW55IGZpbGVzXCJcbn07XG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBmaWxlIGlzIGEgRGF0YVRyYW5zZmVySXRlbSB3aXRoIGFuIGVtcHR5IHR5cGUuXG4gKlxuICogRHVyaW5nIGRyYWcgZXZlbnRzLCBicm93c2VycyBtYXkgcmV0dXJuIERhdGFUcmFuc2Zlckl0ZW0gb2JqZWN0cyBpbnN0ZWFkIG9mIEZpbGUgb2JqZWN0cy5cbiAqIFNvbWUgYnJvd3NlcnMgKGUuZy4sIENocm9tZSkgcmV0dXJuIGFuIGVtcHR5IE1JTUUgdHlwZSBmb3IgY2VydGFpbiBmaWxlIHR5cGVzIChsaWtlIC5tZCBmaWxlcylcbiAqIG9uIERhdGFUcmFuc2Zlckl0ZW0gZHVyaW5nIGRyYWcgZXZlbnRzLCBldmVuIHRob3VnaCB0aGUgdHlwZSBpcyBjb3JyZWN0bHkgc2V0IGR1cmluZyBkcm9wLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gZGV0ZWN0cyBzdWNoIGNhc2VzIGJ5IGNoZWNraW5nIGZvcjpcbiAqIDEuIEVtcHR5IHR5cGUgc3RyaW5nXG4gKiAyLiBQcmVzZW5jZSBvZiBnZXRBc0ZpbGUgbWV0aG9kIChpbmRpY2F0ZXMgaXQncyBhIERhdGFUcmFuc2Zlckl0ZW0sIG5vdCBhIEZpbGUpXG4gKlxuICogV2UgYWNjZXB0IHRoZXNlIGR1cmluZyBkcmFnIHRvIHByb3ZpZGUgcHJvcGVyIFVJIGZlZWRiYWNrLCB3aGlsZSBtYWludGFpbmluZ1xuICogc3RyaWN0IHZhbGlkYXRpb24gZHVyaW5nIGRyb3Agd2hlbiByZWFsIEZpbGUgb2JqZWN0cyBhcmUgYXZhaWxhYmxlLlxuICpcbiAqIEBwYXJhbSB7RmlsZSB8IERhdGFUcmFuc2Zlckl0ZW19IGZpbGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFUcmFuc2Zlckl0ZW1XaXRoRW1wdHlUeXBlKGZpbGUpIHtcbiAgcmV0dXJuIGZpbGUudHlwZSA9PT0gXCJcIiAmJiB0eXBlb2YgZmlsZS5nZXRBc0ZpbGUgPT09IFwiZnVuY3Rpb25cIjtcbn1cbi8qKlxuICogQ2hlY2sgaWYgZmlsZSBpcyBhY2NlcHRlZC5cbiAqXG4gKiBGaXJlZm94IHZlcnNpb25zIHByaW9yIHRvIDUzIHJldHVybiBhIGJvZ3VzIE1JTUUgdHlwZSBmb3IgZXZlcnkgZmlsZSBkcmFnLFxuICogc28gZHJhZ292ZXJzIHdpdGggdGhhdCBNSU1FIHR5cGUgd2lsbCBhbHdheXMgYmUgYWNjZXB0ZWQuXG4gKlxuICogQ2hyb21lL290aGVyIGJyb3dzZXJzIG1heSByZXR1cm4gYW4gZW1wdHkgTUlNRSB0eXBlIGZvciBmaWxlcyBkdXJpbmcgZHJhZyBldmVudHMsXG4gKiBzbyB3ZSBhY2NlcHQgdGhvc2UgYXMgd2VsbCAod2UnbGwgdmFsaWRhdGUgcHJvcGVybHkgb24gZHJvcCkuXG4gKlxuICogQHBhcmFtIHtGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge3N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuc1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxlQWNjZXB0ZWQoZmlsZSwgYWNjZXB0KSB7XG4gIHZhciBpc0FjY2VwdGFibGUgPSBmaWxlLnR5cGUgPT09IFwiYXBwbGljYXRpb24veC1tb3otZmlsZVwiIHx8IGFjY2VwdHMoZmlsZSwgYWNjZXB0KSB8fCBpc0RhdGFUcmFuc2Zlckl0ZW1XaXRoRW1wdHlUeXBlKGZpbGUpO1xuICByZXR1cm4gW2lzQWNjZXB0YWJsZSwgaXNBY2NlcHRhYmxlID8gbnVsbCA6IGdldEludmFsaWRUeXBlUmVqZWN0aW9uRXJyKGFjY2VwdCldO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVNYXRjaFNpemUoZmlsZSwgbWluU2l6ZSwgbWF4U2l6ZSkge1xuICBpZiAoaXNEZWZpbmVkKGZpbGUuc2l6ZSkpIHtcbiAgICBpZiAoaXNEZWZpbmVkKG1pblNpemUpICYmIGlzRGVmaW5lZChtYXhTaXplKSkge1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IG1heFNpemUpIHJldHVybiBbZmFsc2UsIGdldFRvb0xhcmdlUmVqZWN0aW9uRXJyKG1heFNpemUpXTtcbiAgICAgIGlmIChmaWxlLnNpemUgPCBtaW5TaXplKSByZXR1cm4gW2ZhbHNlLCBnZXRUb29TbWFsbFJlamVjdGlvbkVycihtaW5TaXplKV07XG4gICAgfSBlbHNlIGlmIChpc0RlZmluZWQobWluU2l6ZSkgJiYgZmlsZS5zaXplIDwgbWluU2l6ZSkgcmV0dXJuIFtmYWxzZSwgZ2V0VG9vU21hbGxSZWplY3Rpb25FcnIobWluU2l6ZSldO2Vsc2UgaWYgKGlzRGVmaW5lZChtYXhTaXplKSAmJiBmaWxlLnNpemUgPiBtYXhTaXplKSByZXR1cm4gW2ZhbHNlLCBnZXRUb29MYXJnZVJlamVjdGlvbkVycihtYXhTaXplKV07XG4gIH1cblxuICByZXR1cm4gW3RydWUsIG51bGxdO1xufVxuXG5mdW5jdGlvbiBpc0RlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGw7XG59XG4vKipcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGaWxlW119IG9wdGlvbnMuZmlsZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5hY2NlcHRdXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWluU2l6ZV1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhTaXplXVxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5tdWx0aXBsZV1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhGaWxlc11cbiAqIEBwYXJhbSB7KGY6IEZpbGUpID0+IEZpbGVFcnJvcnxGaWxlRXJyb3JbXXxudWxsfSBbb3B0aW9ucy52YWxpZGF0b3JdXG4gKiBAcmV0dXJuc1xuICovXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbEZpbGVzQWNjZXB0ZWQoX3JlZikge1xuICB2YXIgZmlsZXMgPSBfcmVmLmZpbGVzLFxuICAgICAgYWNjZXB0ID0gX3JlZi5hY2NlcHQsXG4gICAgICBtaW5TaXplID0gX3JlZi5taW5TaXplLFxuICAgICAgbWF4U2l6ZSA9IF9yZWYubWF4U2l6ZSxcbiAgICAgIG11bHRpcGxlID0gX3JlZi5tdWx0aXBsZSxcbiAgICAgIG1heEZpbGVzID0gX3JlZi5tYXhGaWxlcyxcbiAgICAgIHZhbGlkYXRvciA9IF9yZWYudmFsaWRhdG9yO1xuXG4gIGlmICghbXVsdGlwbGUgJiYgZmlsZXMubGVuZ3RoID4gMSB8fCBtdWx0aXBsZSAmJiBtYXhGaWxlcyA+PSAxICYmIGZpbGVzLmxlbmd0aCA+IG1heEZpbGVzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVzLmV2ZXJ5KGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgdmFyIF9maWxlQWNjZXB0ZWQgPSBmaWxlQWNjZXB0ZWQoZmlsZSwgYWNjZXB0KSxcbiAgICAgICAgX2ZpbGVBY2NlcHRlZDIgPSBfc2xpY2VkVG9BcnJheShfZmlsZUFjY2VwdGVkLCAxKSxcbiAgICAgICAgYWNjZXB0ZWQgPSBfZmlsZUFjY2VwdGVkMlswXTtcblxuICAgIHZhciBfZmlsZU1hdGNoU2l6ZSA9IGZpbGVNYXRjaFNpemUoZmlsZSwgbWluU2l6ZSwgbWF4U2l6ZSksXG4gICAgICAgIF9maWxlTWF0Y2hTaXplMiA9IF9zbGljZWRUb0FycmF5KF9maWxlTWF0Y2hTaXplLCAxKSxcbiAgICAgICAgc2l6ZU1hdGNoID0gX2ZpbGVNYXRjaFNpemUyWzBdO1xuXG4gICAgdmFyIGN1c3RvbUVycm9ycyA9IHZhbGlkYXRvciA/IHZhbGlkYXRvcihmaWxlKSA6IG51bGw7XG4gICAgcmV0dXJuIGFjY2VwdGVkICYmIHNpemVNYXRjaCAmJiAhY3VzdG9tRXJyb3JzO1xuICB9KTtcbn0gLy8gUmVhY3QncyBzeW50aGV0aWMgZXZlbnRzIGhhcyBldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCxcbi8vIGJ1dCB0byByZW1haW4gY29tcGF0aWJpbGl0eSB3aXRoIG90aGVyIGxpYnMgKFByZWFjdCkgZmFsbCBiYWNrXG4vLyB0byBjaGVjayBldmVudC5jYW5jZWxCdWJibGVcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KSB7XG4gIGlmICh0eXBlb2YgZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBldmVudC5jYW5jZWxCdWJibGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4gZXZlbnQuY2FuY2VsQnViYmxlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSB7XG4gIGlmICghZXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgcmV0dXJuICEhZXZlbnQudGFyZ2V0ICYmICEhZXZlbnQudGFyZ2V0LmZpbGVzO1xuICB9IC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EYXRhVHJhbnNmZXIvdHlwZXNcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxfRHJhZ19hbmRfRHJvcF9BUEkvUmVjb21tZW5kZWRfZHJhZ190eXBlcyNmaWxlXG5cblxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNvbWUuY2FsbChldmVudC5kYXRhVHJhbnNmZXIudHlwZXMsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHR5cGUgPT09IFwiRmlsZXNcIiB8fCB0eXBlID09PSBcImFwcGxpY2F0aW9uL3gtbW96LWZpbGVcIjtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNLaW5kRmlsZShpdGVtKSB7XG4gIHJldHVybiBfdHlwZW9mKGl0ZW0pID09PSBcIm9iamVjdFwiICYmIGl0ZW0gIT09IG51bGwgJiYgaXRlbS5raW5kID09PSBcImZpbGVcIjtcbn0gLy8gYWxsb3cgdGhlIGVudGlyZSBkb2N1bWVudCB0byBiZSBhIGRyYWcgdGFyZ2V0XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkRvY3VtZW50RHJhZ092ZXIoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cblxuZnVuY3Rpb24gaXNJZSh1c2VyQWdlbnQpIHtcbiAgcmV0dXJuIHVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSAhPT0gLTEgfHwgdXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50L1wiKSAhPT0gLTE7XG59XG5cbmZ1bmN0aW9uIGlzRWRnZSh1c2VyQWdlbnQpIHtcbiAgcmV0dXJuIHVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZS9cIikgIT09IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJZU9yRWRnZSgpIHtcbiAgdmFyIHVzZXJBZ2VudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiBpc0llKHVzZXJBZ2VudCkgfHwgaXNFZGdlKHVzZXJBZ2VudCk7XG59XG4vKipcbiAqIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCB0byBjb21wb3NlIGV2ZW50IGhhbmRsZXJzXG4gKiBUaGV5IGFyZSBleGVjdXRlZCBpbiBvcmRlciB1bnRpbCBvbmUgb2YgdGhlbSBjYWxscyBgZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKWAuXG4gKiBOb3RlIHRoYXQgdGhlIGNoZWNrIGlzIGRvbmUgb24gdGhlIGZpcnN0IGludm9rZSB0b28sXG4gKiBtZWFuaW5nIHRoYXQgaWYgcHJvcGFnYXRpb24gd2FzIHN0b3BwZWQgYmVmb3JlIGludm9raW5nIHRoZSBmbnMsXG4gKiBubyBoYW5kbGVycyB3aWxsIGJlIGV4ZWN1dGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZucyB0aGUgZXZlbnQgaGFubGRlciBmdW5jdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgZXZlbnQgaGFuZGxlciB0byBhZGQgdG8gYW4gZWxlbWVudFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlRXZlbnRIYW5kbGVycygpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZucy5zb21lKGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKCFpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCkgJiYgZm4pIHtcbiAgICAgICAgZm4uYXBwbHkodm9pZCAwLCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCk7XG4gICAgfSk7XG4gIH07XG59XG4vKipcbiAqIGNhblVzZUZpbGVTeXN0ZW1BY2Nlc3NBUEkgY2hlY2tzIGlmIHRoZSBbRmlsZSBTeXN0ZW0gQWNjZXNzIEFQSV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVfU3lzdGVtX0FjY2Vzc19BUEkpXG4gKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2FuVXNlRmlsZVN5c3RlbUFjY2Vzc0FQSSgpIHtcbiAgcmV0dXJuIFwic2hvd09wZW5GaWxlUGlja2VyXCIgaW4gd2luZG93O1xufVxuLyoqXG4gKiBDb252ZXJ0IHRoZSBge2FjY2VwdH1gIGRyb3B6b25lIHByb3AgdG8gdGhlXG4gKiBge3R5cGVzfWAgb3B0aW9uIGZvciBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3Nob3dPcGVuRmlsZVBpY2tlclxuICpcbiAqIEBwYXJhbSB7QWNjZXB0UHJvcH0gYWNjZXB0XG4gKiBAcmV0dXJucyB7e2FjY2VwdDogc3RyaW5nW119W119XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tlck9wdGlvbnNGcm9tQWNjZXB0KGFjY2VwdCkge1xuICBpZiAoaXNEZWZpbmVkKGFjY2VwdCkpIHtcbiAgICB2YXIgYWNjZXB0Rm9yUGlja2VyID0gT2JqZWN0LmVudHJpZXMoYWNjZXB0KS5maWx0ZXIoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICB2YXIgX3JlZjMgPSBfc2xpY2VkVG9BcnJheShfcmVmMiwgMiksXG4gICAgICAgICAgbWltZVR5cGUgPSBfcmVmM1swXSxcbiAgICAgICAgICBleHQgPSBfcmVmM1sxXTtcblxuICAgICAgdmFyIG9rID0gdHJ1ZTtcblxuICAgICAgaWYgKCFpc01JTUVUeXBlKG1pbWVUeXBlKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJTa2lwcGVkIFxcXCJcIi5jb25jYXQobWltZVR5cGUsIFwiXFxcIiBiZWNhdXNlIGl0IGlzIG5vdCBhIHZhbGlkIE1JTUUgdHlwZS4gQ2hlY2sgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9CYXNpY3Nfb2ZfSFRUUC9NSU1FX3R5cGVzL0NvbW1vbl90eXBlcyBmb3IgYSBsaXN0IG9mIHZhbGlkIE1JTUUgdHlwZXMuXCIpKTtcbiAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV4dCkgfHwgIWV4dC5ldmVyeShpc0V4dCkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiU2tpcHBlZCBcXFwiXCIuY29uY2F0KG1pbWVUeXBlLCBcIlxcXCIgYmVjYXVzZSBhbiBpbnZhbGlkIGZpbGUgZXh0ZW5zaW9uIHdhcyBwcm92aWRlZC5cIikpO1xuICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2s7XG4gICAgfSkucmVkdWNlKGZ1bmN0aW9uIChhZ2csIF9yZWY0KSB7XG4gICAgICB2YXIgX3JlZjUgPSBfc2xpY2VkVG9BcnJheShfcmVmNCwgMiksXG4gICAgICAgICAgbWltZVR5cGUgPSBfcmVmNVswXSxcbiAgICAgICAgICBleHQgPSBfcmVmNVsxXTtcblxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgYWdnKSwge30sIF9kZWZpbmVQcm9wZXJ0eSh7fSwgbWltZVR5cGUsIGV4dCkpO1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gW3tcbiAgICAgIC8vIGRlc2NyaXB0aW9uIGlzIHJlcXVpcmVkIGR1ZSB0byBodHRwczovL2NyYnVnLmNvbS8xMjY0NzA4XG4gICAgICBkZXNjcmlwdGlvbjogXCJGaWxlc1wiLFxuICAgICAgYWNjZXB0OiBhY2NlcHRGb3JQaWNrZXJcbiAgICB9XTtcbiAgfVxuXG4gIHJldHVybiBhY2NlcHQ7XG59XG4vKipcbiAqIENvbnZlcnQgdGhlIGB7YWNjZXB0fWAgZHJvcHpvbmUgcHJvcCB0byBhbiBhcnJheSBvZiBNSU1FIHR5cGVzL2V4dGVuc2lvbnMuXG4gKiBAcGFyYW0ge0FjY2VwdFByb3B9IGFjY2VwdFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYWNjZXB0UHJvcEFzQWNjZXB0QXR0cihhY2NlcHQpIHtcbiAgaWYgKGlzRGVmaW5lZChhY2NlcHQpKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGFjY2VwdCkucmVkdWNlKGZ1bmN0aW9uIChhLCBfcmVmNikge1xuICAgICAgdmFyIF9yZWY3ID0gX3NsaWNlZFRvQXJyYXkoX3JlZjYsIDIpLFxuICAgICAgICAgIG1pbWVUeXBlID0gX3JlZjdbMF0sXG4gICAgICAgICAgZXh0ID0gX3JlZjdbMV07XG5cbiAgICAgIHJldHVybiBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KGEpLCBbbWltZVR5cGVdLCBfdG9Db25zdW1hYmxlQXJyYXkoZXh0KSk7XG4gICAgfSwgW10pIC8vIFNpbGVudGx5IGRpc2NhcmQgaW52YWxpZCBlbnRyaWVzIGFzIHBpY2tlck9wdGlvbnNGcm9tQWNjZXB0IHdhcm5zIGFib3V0IHRoZXNlXG4gICAgLmZpbHRlcihmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIGlzTUlNRVR5cGUodikgfHwgaXNFeHQodik7XG4gICAgfSkuam9pbihcIixcIik7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGFuIGV4Y2VwdGlvbiBjYXVzZWQgYnkgYWJvcnRpbmcgYSByZXF1ZXN0IChlLmcgd2luZG93LnNob3dPcGVuRmlsZVBpY2tlcigpKS5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTUV4Y2VwdGlvbi5cbiAqIEBwYXJhbSB7YW55fSB2XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2IGlzIGFuIGFib3J0IGV4Y2VwdGlvbi5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNBYm9ydCh2KSB7XG4gIHJldHVybiB2IGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uICYmICh2Lm5hbWUgPT09IFwiQWJvcnRFcnJvclwiIHx8IHYuY29kZSA9PT0gdi5BQk9SVF9FUlIpO1xufVxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGEgc2VjdXJpdHkgZXJyb3IuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01FeGNlcHRpb24uXG4gKiBAcGFyYW0ge2FueX0gdlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdiBpcyBhIHNlY3VyaXR5IGVycm9yLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NlY3VyaXR5RXJyb3Iodikge1xuICByZXR1cm4gdiBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbiAmJiAodi5uYW1lID09PSBcIlNlY3VyaXR5RXJyb3JcIiB8fCB2LmNvZGUgPT09IHYuU0VDVVJJVFlfRVJSKTtcbn1cbi8qKlxuICogQ2hlY2sgaWYgdiBpcyBhIE1JTUUgdHlwZSBzdHJpbmcuXG4gKlxuICogU2VlIGFjY2VwdGVkIGZvcm1hdDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9FbGVtZW50L2lucHV0L2ZpbGUjdW5pcXVlX2ZpbGVfdHlwZV9zcGVjaWZpZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTUlNRVR5cGUodikge1xuICByZXR1cm4gdiA9PT0gXCJhdWRpby8qXCIgfHwgdiA9PT0gXCJ2aWRlby8qXCIgfHwgdiA9PT0gXCJpbWFnZS8qXCIgfHwgdiA9PT0gXCJ0ZXh0LypcIiB8fCB2ID09PSBcImFwcGxpY2F0aW9uLypcIiB8fCAvXFx3K1xcL1stKy5cXHddKy9nLnRlc3Qodik7XG59XG4vKipcbiAqIENoZWNrIGlmIHYgaXMgYSBmaWxlIGV4dGVuc2lvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXh0KHYpIHtcbiAgcmV0dXJuIC9eLipcXC5bXFx3XSskLy50ZXN0KHYpO1xufVxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0LjxzdHJpbmcsIHN0cmluZ1tdPn0gQWNjZXB0UHJvcFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gRmlsZUVycm9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWVzc2FnZVxuICogQHByb3BlcnR5IHtFcnJvckNvZGV8c3RyaW5nfSBjb2RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7XCJmaWxlLWludmFsaWQtdHlwZVwifFwiZmlsZS10b28tbGFyZ2VcInxcImZpbGUtdG9vLXNtYWxsXCJ8XCJ0b28tbWFueS1maWxlc1wifSBFcnJvckNvZGVcbiAqLyIsInZhciBfZXhjbHVkZWQgPSBbXCJjaGlsZHJlblwiXSxcbiAgICBfZXhjbHVkZWQyID0gW1wib3BlblwiXSxcbiAgICBfZXhjbHVkZWQzID0gW1wicmVmS2V5XCIsIFwicm9sZVwiLCBcIm9uS2V5RG93blwiLCBcIm9uRm9jdXNcIiwgXCJvbkJsdXJcIiwgXCJvbkNsaWNrXCIsIFwib25EcmFnRW50ZXJcIiwgXCJvbkRyYWdPdmVyXCIsIFwib25EcmFnTGVhdmVcIiwgXCJvbkRyb3BcIl0sXG4gICAgX2V4Y2x1ZGVkNCA9IFtcInJlZktleVwiLCBcIm9uQ2hhbmdlXCIsIFwib25DbGlja1wiXTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KGFycik7IH1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9pID0gYXJyID09IG51bGwgPyBudWxsIDogdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcnJbU3ltYm9sLml0ZXJhdG9yXSB8fCBhcnJbXCJAQGl0ZXJhdG9yXCJdOyBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9zLCBfZTsgdHJ5IHsgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gbnVsbCAhPSBhcmd1bWVudHNbaV0gPyBhcmd1bWVudHNbaV0gOiB7fTsgaSAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSA6IG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpOyB2YXIga2V5LCBpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc291cmNlU3ltYm9sS2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZVN5bWJvbEtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlU3ltYm9sS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgaWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoc291cmNlLCBrZXkpKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IHt9OyB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7IHZhciBrZXksIGk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZUtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG4vKiBlc2xpbnQgcHJlZmVyLXRlbXBsYXRlOiAwICovXG5pbXBvcnQgUmVhY3QsIHsgZm9yd2FyZFJlZiwgRnJhZ21lbnQsIHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZUltcGVyYXRpdmVIYW5kbGUsIHVzZU1lbW8sIHVzZVJlZHVjZXIsIHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tIFwicHJvcC10eXBlc1wiO1xuaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSBcImZpbGUtc2VsZWN0b3JcIjtcbmltcG9ydCB7IGFjY2VwdFByb3BBc0FjY2VwdEF0dHIsIGFsbEZpbGVzQWNjZXB0ZWQsIGNvbXBvc2VFdmVudEhhbmRsZXJzLCBmaWxlQWNjZXB0ZWQsIGZpbGVNYXRjaFNpemUsIGNhblVzZUZpbGVTeXN0ZW1BY2Nlc3NBUEksIGlzQWJvcnQsIGlzRXZ0V2l0aEZpbGVzLCBpc0llT3JFZGdlLCBpc1Byb3BhZ2F0aW9uU3RvcHBlZCwgaXNTZWN1cml0eUVycm9yLCBvbkRvY3VtZW50RHJhZ092ZXIsIHBpY2tlck9wdGlvbnNGcm9tQWNjZXB0LCBUT09fTUFOWV9GSUxFU19SRUpFQ1RJT04gfSBmcm9tIFwiLi91dGlscy9pbmRleC5qc1wiO1xuLyoqXG4gKiBDb252ZW5pZW5jZSB3cmFwcGVyIGNvbXBvbmVudCBmb3IgdGhlIGB1c2VEcm9wem9uZWAgaG9va1xuICpcbiAqIGBgYGpzeFxuICogPERyb3B6b25lPlxuICogICB7KHtnZXRSb290UHJvcHMsIGdldElucHV0UHJvcHN9KSA9PiAoXG4gKiAgICAgPGRpdiB7Li4uZ2V0Um9vdFByb3BzKCl9PlxuICogICAgICAgPGlucHV0IHsuLi5nZXRJbnB1dFByb3BzKCl9IC8+XG4gKiAgICAgICA8cD5EcmFnICduJyBkcm9wIHNvbWUgZmlsZXMgaGVyZSwgb3IgY2xpY2sgdG8gc2VsZWN0IGZpbGVzPC9wPlxuICogICAgIDwvZGl2PlxuICogICApfVxuICogPC9Ecm9wem9uZT5cbiAqIGBgYFxuICovXG5cbnZhciBEcm9wem9uZSA9IC8qI19fUFVSRV9fKi9mb3J3YXJkUmVmKGZ1bmN0aW9uIChfcmVmLCByZWYpIHtcbiAgdmFyIGNoaWxkcmVuID0gX3JlZi5jaGlsZHJlbixcbiAgICAgIHBhcmFtcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBfZXhjbHVkZWQpO1xuXG4gIHZhciBfdXNlRHJvcHpvbmUgPSB1c2VEcm9wem9uZShwYXJhbXMpLFxuICAgICAgb3BlbiA9IF91c2VEcm9wem9uZS5vcGVuLFxuICAgICAgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3VzZURyb3B6b25lLCBfZXhjbHVkZWQyKTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuOiBvcGVuXG4gICAgfTtcbiAgfSwgW29wZW5dKTsgLy8gVE9ETzogRmlndXJlIG91dCB3aHkgcmVhY3Qtc3R5bGVndWlkaXN0IGNhbm5vdCBjcmVhdGUgZG9jcyBpZiB3ZSBkb24ndCByZXR1cm4gYSBqc3ggZWxlbWVudFxuXG4gIHJldHVybiAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChGcmFnbWVudCwgbnVsbCwgY2hpbGRyZW4oX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBwcm9wcyksIHt9LCB7XG4gICAgb3Blbjogb3BlblxuICB9KSkpO1xufSk7XG5Ecm9wem9uZS5kaXNwbGF5TmFtZSA9IFwiRHJvcHpvbmVcIjsgLy8gQWRkIGRlZmF1bHQgcHJvcHMgZm9yIHJlYWN0LWRvY2dlblxuXG52YXIgZGVmYXVsdFByb3BzID0ge1xuICBkaXNhYmxlZDogZmFsc2UsXG4gIGdldEZpbGVzRnJvbUV2ZW50OiBmcm9tRXZlbnQsXG4gIG1heFNpemU6IEluZmluaXR5LFxuICBtaW5TaXplOiAwLFxuICBtdWx0aXBsZTogdHJ1ZSxcbiAgbWF4RmlsZXM6IDAsXG4gIHByZXZlbnREcm9wT25Eb2N1bWVudDogdHJ1ZSxcbiAgbm9DbGljazogZmFsc2UsXG4gIG5vS2V5Ym9hcmQ6IGZhbHNlLFxuICBub0RyYWc6IGZhbHNlLFxuICBub0RyYWdFdmVudHNCdWJibGluZzogZmFsc2UsXG4gIHZhbGlkYXRvcjogbnVsbCxcbiAgdXNlRnNBY2Nlc3NBcGk6IGZhbHNlLFxuICBhdXRvRm9jdXM6IGZhbHNlXG59O1xuRHJvcHpvbmUuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuRHJvcHpvbmUucHJvcFR5cGVzID0ge1xuICAvKipcbiAgICogUmVuZGVyIGZ1bmN0aW9uIHRoYXQgZXhwb3NlcyB0aGUgZHJvcHpvbmUgc3RhdGUgYW5kIHByb3AgZ2V0dGVyIGZuc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcmFtcy5nZXRSb290UHJvcHMgUmV0dXJucyB0aGUgcHJvcHMgeW91IHNob3VsZCBhcHBseSB0byB0aGUgcm9vdCBkcm9wIGNvbnRhaW5lciB5b3UgcmVuZGVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcmFtcy5nZXRJbnB1dFByb3BzIFJldHVybnMgdGhlIHByb3BzIHlvdSBzaG91bGQgYXBwbHkgdG8gaGlkZGVuIGZpbGUgaW5wdXQgeW91IHJlbmRlclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJhbXMub3BlbiBPcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRm9jdXNlZCBEcm9wem9uZSBhcmVhIGlzIGluIGZvY3VzXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRmlsZURpYWxvZ0FjdGl2ZSBGaWxlIGRpYWxvZyBpcyBvcGVuZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNEcmFnQWN0aXZlIEFjdGl2ZSBkcmFnIGlzIGluIHByb2dyZXNzXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRHJhZ0FjY2VwdCBEcmFnZ2VkIGZpbGVzIGFyZSBhY2NlcHRlZFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0RyYWdSZWplY3QgVHJ1ZSBvbmx5IGR1cmluZyBhbiBhY3RpdmUgZHJhZyB3aGVuIHNvbWUgZHJhZ2dlZCBmaWxlcyB3b3VsZCBiZSByZWplY3RlZC4gQWZ0ZXIgZHJvcCwgdGhpcyByZXNldHMgdG8gZmFsc2UuIFVzZSBmaWxlUmVqZWN0aW9ucyBmb3IgcG9zdC1kcm9wIGVycm9ycy5cbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNEcmFnR2xvYmFsIEZpbGVzIGFyZSBiZWluZyBkcmFnZ2VkIGFueXdoZXJlIG9uIHRoZSBkb2N1bWVudFxuICAgKiBAcGFyYW0ge0ZpbGVbXX0gcGFyYW1zLmFjY2VwdGVkRmlsZXMgQWNjZXB0ZWQgZmlsZXNcbiAgICogQHBhcmFtIHtGaWxlUmVqZWN0aW9uW119IHBhcmFtcy5maWxlUmVqZWN0aW9ucyBSZWplY3RlZCBmaWxlcyBhbmQgd2h5IHRoZXkgd2VyZSByZWplY3RlZC4gVGhpcyBwZXJzaXN0cyBhZnRlciBkcm9wIGFuZCBpcyB0aGUgc291cmNlIG9mIHRydXRoIGZvciBwb3N0LWRyb3AgcmVqZWN0aW9ucy5cbiAgICovXG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogU2V0IGFjY2VwdGVkIGZpbGUgdHlwZXMuXG4gICAqIENoZWNrb3V0IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cvc2hvd09wZW5GaWxlUGlja2VyIHR5cGVzIG9wdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICogS2VlcCBpbiBtaW5kIHRoYXQgbWltZSB0eXBlIGRldGVybWluYXRpb24gaXMgbm90IHJlbGlhYmxlIGFjcm9zcyBwbGF0Zm9ybXMuIENTViBmaWxlcyxcbiAgICogZm9yIGV4YW1wbGUsIGFyZSByZXBvcnRlZCBhcyB0ZXh0L3BsYWluIHVuZGVyIG1hY09TIGJ1dCBhcyBhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwgdW5kZXJcbiAgICogV2luZG93cy4gSW4gc29tZSBjYXNlcyB0aGVyZSBtaWdodCBub3QgYmUgYSBtaW1lIHR5cGUgc2V0IGF0IGFsbCAoaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0LWRyb3B6b25lL3JlYWN0LWRyb3B6b25lL2lzc3Vlcy8yNzYpLlxuICAgKi9cbiAgYWNjZXB0OiBQcm9wVHlwZXMub2JqZWN0T2YoUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZykpLFxuXG4gIC8qKlxuICAgKiBBbGxvdyBkcmFnICduJyBkcm9wIChvciBzZWxlY3Rpb24gZnJvbSB0aGUgZmlsZSBkaWFsb2cpIG9mIG11bHRpcGxlIGZpbGVzXG4gICAqL1xuICBtdWx0aXBsZTogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIGZhbHNlLCBhbGxvdyBkcm9wcGVkIGl0ZW1zIHRvIHRha2Ugb3ZlciB0aGUgY3VycmVudCBicm93c2VyIHdpbmRvd1xuICAgKi9cbiAgcHJldmVudERyb3BPbkRvY3VtZW50OiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgZGlzYWJsZXMgY2xpY2sgdG8gb3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZ1xuICAgKi9cbiAgbm9DbGljazogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGRpc2FibGVzIFNQQUNFL0VOVEVSIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2cuXG4gICAqIE5vdGUgdGhhdCBpdCBhbHNvIHN0b3BzIHRyYWNraW5nIHRoZSBmb2N1cyBzdGF0ZS5cbiAgICovXG4gIG5vS2V5Ym9hcmQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBkaXNhYmxlcyBkcmFnICduJyBkcm9wXG4gICAqL1xuICBub0RyYWc6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBzdG9wcyBkcmFnIGV2ZW50IHByb3BhZ2F0aW9uIHRvIHBhcmVudHNcbiAgICovXG4gIG5vRHJhZ0V2ZW50c0J1YmJsaW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogTWluaW11bSBmaWxlIHNpemUgKGluIGJ5dGVzKVxuICAgKi9cbiAgbWluU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICogTWF4aW11bSBmaWxlIHNpemUgKGluIGJ5dGVzKVxuICAgKi9cbiAgbWF4U2l6ZTogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICogTWF4aW11bSBhY2NlcHRlZCBudW1iZXIgb2YgZmlsZXNcbiAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgMCB3aGljaCBtZWFucyB0aGVyZSBpcyBubyBsaW1pdGF0aW9uIHRvIGhvdyBtYW55IGZpbGVzIGFyZSBhY2NlcHRlZC5cbiAgICovXG4gIG1heEZpbGVzOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgKiBFbmFibGUvZGlzYWJsZSB0aGUgZHJvcHpvbmVcbiAgICovXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogVXNlIHRoaXMgdG8gcHJvdmlkZSBhIGN1c3RvbSBmaWxlIGFnZ3JlZ2F0b3JcbiAgICpcbiAgICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50fEFycmF5PEZpbGVTeXN0ZW1GaWxlSGFuZGxlPil9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAgICovXG4gIGdldEZpbGVzRnJvbUV2ZW50OiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gY2xvc2luZyB0aGUgZmlsZSBkaWFsb2cgd2l0aCBubyBzZWxlY3Rpb25cbiAgICovXG4gIG9uRmlsZURpYWxvZ0NhbmNlbDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIG9wZW5pbmcgdGhlIGZpbGUgZGlhbG9nXG4gICAqL1xuICBvbkZpbGVEaWFsb2dPcGVuOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogU2V0IHRvIHRydWUgdG8gdXNlIHRoZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZV9TeXN0ZW1fQWNjZXNzX0FQSVxuICAgKiB0byBvcGVuIHRoZSBmaWxlIHBpY2tlciBpbnN0ZWFkIG9mIHVzaW5nIGFuIGA8aW5wdXQgdHlwZT1cImZpbGVcIj5gIGNsaWNrIGV2ZW50LlxuICAgKi9cbiAgdXNlRnNBY2Nlc3NBcGk6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSB0byBmb2N1cyB0aGUgcm9vdCBlbGVtZW50IG9uIHJlbmRlclxuICAgKi9cbiAgYXV0b0ZvY3VzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcmFnZW50ZXJgIGV2ZW50IG9jY3Vycy5cbiAgICpcbiAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50XG4gICAqL1xuICBvbkRyYWdFbnRlcjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJhZ2xlYXZlYCBldmVudCBvY2N1cnNcbiAgICpcbiAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50XG4gICAqL1xuICBvbkRyYWdMZWF2ZTogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJhZ292ZXJgIGV2ZW50IG9jY3Vyc1xuICAgKlxuICAgKiBAcGFyYW0ge0RyYWdFdmVudH0gZXZlbnRcbiAgICovXG4gIG9uRHJhZ092ZXI6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyb3BgIGV2ZW50IG9jY3Vycy5cbiAgICogTm90ZSB0aGF0IHRoaXMgY2FsbGJhY2sgaXMgaW52b2tlZCBhZnRlciB0aGUgYGdldEZpbGVzRnJvbUV2ZW50YCBjYWxsYmFjayBpcyBkb25lLlxuICAgKlxuICAgKiBGaWxlcyBhcmUgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQgYmFzZWQgb24gdGhlIGBhY2NlcHRgLCBgbXVsdGlwbGVgLCBgbWluU2l6ZWAgYW5kIGBtYXhTaXplYCBwcm9wcy5cbiAgICogYGFjY2VwdGAgbXVzdCBiZSBhIHZhbGlkIFtNSU1FIHR5cGVdKGh0dHA6Ly93d3cuaWFuYS5vcmcvYXNzaWdubWVudHMvbWVkaWEtdHlwZXMvbWVkaWEtdHlwZXMueGh0bWwpIGFjY29yZGluZyB0byBbaW5wdXQgZWxlbWVudCBzcGVjaWZpY2F0aW9uXShodHRwczovL3d3dy53My5vcmcvd2lraS9IVE1ML0VsZW1lbnRzL2lucHV0L2ZpbGUpIG9yIGEgdmFsaWQgZmlsZSBleHRlbnNpb24uXG4gICAqIElmIGBtdWx0aXBsZWAgaXMgc2V0IHRvIGZhbHNlIGFuZCBhZGRpdGlvbmFsIGZpbGVzIGFyZSBkcm9wcGVkLFxuICAgKiBhbGwgZmlsZXMgYmVzaWRlcyB0aGUgZmlyc3Qgd2lsbCBiZSByZWplY3RlZC5cbiAgICogQW55IGZpbGUgd2hpY2ggZG9lcyBub3QgaGF2ZSBhIHNpemUgaW4gdGhlIFtgbWluU2l6ZWAsIGBtYXhTaXplYF0gcmFuZ2UsIHdpbGwgYmUgcmVqZWN0ZWQgYXMgd2VsbC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBgb25Ecm9wYCBjYWxsYmFjayB3aWxsIGFsd2F5cyBiZSBpbnZva2VkIHJlZ2FyZGxlc3MgaWYgdGhlIGRyb3BwZWQgZmlsZXMgd2VyZSBhY2NlcHRlZCBvciByZWplY3RlZC5cbiAgICogSWYgeW91J2QgbGlrZSB0byByZWFjdCB0byBhIHNwZWNpZmljIHNjZW5hcmlvLCB1c2UgdGhlIGBvbkRyb3BBY2NlcHRlZGAvYG9uRHJvcFJlamVjdGVkYCBwcm9wcy5cbiAgICpcbiAgICogYG9uRHJvcGAgd2lsbCBwcm92aWRlIHlvdSB3aXRoIGFuIGFycmF5IG9mIFtGaWxlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZSkgb2JqZWN0cyB3aGljaCB5b3UgY2FuIHRoZW4gcHJvY2VzcyBhbmQgc2VuZCB0byBhIHNlcnZlci5cbiAgICogRm9yIGV4YW1wbGUsIHdpdGggW1N1cGVyQWdlbnRdKGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9zdXBlcmFnZW50KSBhcyBhIGh0dHAvYWpheCBsaWJyYXJ5OlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBmdW5jdGlvbiBvbkRyb3AoYWNjZXB0ZWRGaWxlcykge1xuICAgKiAgIGNvbnN0IHJlcSA9IHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gICAqICAgYWNjZXB0ZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgKiAgICAgcmVxLmF0dGFjaChmaWxlLm5hbWUsIGZpbGUpXG4gICAqICAgfSlcbiAgICogICByZXEuZW5kKGNhbGxiYWNrKVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge0ZpbGVbXX0gYWNjZXB0ZWRGaWxlc1xuICAgKiBAcGFyYW0ge0ZpbGVSZWplY3Rpb25bXX0gZmlsZVJlamVjdGlvbnNcbiAgICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICAgKi9cbiAgb25Ecm9wOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcm9wYCBldmVudCBvY2N1cnMuXG4gICAqIE5vdGUgdGhhdCBpZiBubyBmaWxlcyBhcmUgYWNjZXB0ZWQsIHRoaXMgY2FsbGJhY2sgaXMgbm90IGludm9rZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZVtdfSBmaWxlc1xuICAgKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudFxuICAgKi9cbiAgb25Ecm9wQWNjZXB0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyb3BgIGV2ZW50IG9jY3Vycy5cbiAgICogTm90ZSB0aGF0IGlmIG5vIGZpbGVzIGFyZSByZWplY3RlZCwgdGhpcyBjYWxsYmFjayBpcyBub3QgaW52b2tlZC5cbiAgICpcbiAgICogQHBhcmFtIHtGaWxlUmVqZWN0aW9uW119IGZpbGVSZWplY3Rpb25zXG4gICAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50XG4gICAqL1xuICBvbkRyb3BSZWplY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZXJlJ3Mgc29tZSBlcnJvciBmcm9tIGFueSBvZiB0aGUgcHJvbWlzZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gICAqL1xuICBvbkVycm9yOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb24uIEl0IG11c3QgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBlcnJvcnMuXG4gICAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICAgKiBAcmV0dXJucyB7RmlsZUVycm9yfEZpbGVFcnJvcltdfG51bGx9XG4gICAqL1xuICB2YWxpZGF0b3I6IFByb3BUeXBlcy5mdW5jXG59O1xuZXhwb3J0IGRlZmF1bHQgRHJvcHpvbmU7XG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGZvciB0aGUgYGRyYWdlbnRlcmAsXG4gKiBgZHJhZ292ZXJgIGFuZCBgZHJhZ2xlYXZlYCBldmVudHMuXG4gKiBJdCBpcyBub3QgaW52b2tlZCBpZiB0aGUgaXRlbXMgYXJlIG5vdCBmaWxlcyAoc3VjaCBhcyBsaW5rLCB0ZXh0LCBldGMuKS5cbiAqXG4gKiBAY2FsbGJhY2sgZHJhZ0NiXG4gKiBAcGFyYW0ge0RyYWdFdmVudH0gZXZlbnRcbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGZvciB0aGUgYGRyb3BgIG9yIGlucHV0IGNoYW5nZSBldmVudC5cbiAqIEl0IGlzIG5vdCBpbnZva2VkIGlmIHRoZSBpdGVtcyBhcmUgbm90IGZpbGVzIChzdWNoIGFzIGxpbmssIHRleHQsIGV0Yy4pLlxuICpcbiAqIEBjYWxsYmFjayBkcm9wQ2JcbiAqIEBwYXJhbSB7RmlsZVtdfSBhY2NlcHRlZEZpbGVzIExpc3Qgb2YgYWNjZXB0ZWQgZmlsZXNcbiAqIEBwYXJhbSB7RmlsZVJlamVjdGlvbltdfSBmaWxlUmVqZWN0aW9ucyBMaXN0IG9mIHJlamVjdGVkIGZpbGVzIGFuZCB3aHkgdGhleSB3ZXJlIHJlamVjdGVkLiBUaGlzIGlzIHRoZSBhdXRob3JpdGF0aXZlIHNvdXJjZSBmb3IgcG9zdC1kcm9wIGZpbGUgcmVqZWN0aW9ucy5cbiAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGZvciB0aGUgYGRyb3BgIG9yIGlucHV0IGNoYW5nZSBldmVudC5cbiAqIEl0IGlzIG5vdCBpbnZva2VkIGlmIHRoZSBpdGVtcyBhcmUgZmlsZXMgKHN1Y2ggYXMgbGluaywgdGV4dCwgZXRjLikuXG4gKlxuICogQGNhbGxiYWNrIGRyb3BBY2NlcHRlZENiXG4gKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXMgTGlzdCBvZiBhY2NlcHRlZCBmaWxlcyB0aGF0IG1lZXQgdGhlIGdpdmVuIGNyaXRlcmlhXG4gKiAoYGFjY2VwdGAsIGBtdWx0aXBsZWAsIGBtaW5TaXplYCwgYG1heFNpemVgKVxuICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJvcGAgb3IgaW5wdXQgY2hhbmdlIGV2ZW50LlxuICpcbiAqIEBjYWxsYmFjayBkcm9wUmVqZWN0ZWRDYlxuICogQHBhcmFtIHtGaWxlW119IGZpbGVzIExpc3Qgb2YgcmVqZWN0ZWQgZmlsZXMgdGhhdCBkbyBub3QgbWVldCB0aGUgZ2l2ZW4gY3JpdGVyaWFcbiAqIChgYWNjZXB0YCwgYG11bHRpcGxlYCwgYG1pblNpemVgLCBgbWF4U2l6ZWApXG4gKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gKi9cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBhZ2dyZWdhdGUgZmlsZXMsXG4gKiBpbiBhIGFzeW5jaHJvbm91cyBmYXNoaW9uLCBmcm9tIGRyYWcgb3IgaW5wdXQgY2hhbmdlIGV2ZW50cy5cbiAqXG4gKiBAY2FsbGJhY2sgZ2V0RmlsZXNGcm9tRXZlbnRcbiAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudHxBcnJheTxGaWxlU3lzdGVtRmlsZUhhbmRsZT4pfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gKiBAcmV0dXJucyB7KEZpbGVbXXxQcm9taXNlPEZpbGVbXT4pfVxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHdpdGggdGhlIGN1cnJlbnQgZHJvcHpvbmUgc3RhdGUuXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gRHJvcHpvbmVTdGF0ZVxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0ZvY3VzZWQgRHJvcHpvbmUgYXJlYSBpcyBpbiBmb2N1c1xuICogQHByb3BlcnR5IHtib29sZWFufSBpc0ZpbGVEaWFsb2dBY3RpdmUgRmlsZSBkaWFsb2cgaXMgb3BlbmVkXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRHJhZ0FjdGl2ZSBBY3RpdmUgZHJhZyBpcyBpbiBwcm9ncmVzc1xuICogQHByb3BlcnR5IHtib29sZWFufSBpc0RyYWdBY2NlcHQgRHJhZ2dlZCBmaWxlcyBhcmUgYWNjZXB0ZWRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNEcmFnUmVqZWN0IFRydWUgb25seSBkdXJpbmcgYW4gYWN0aXZlIGRyYWcgd2hlbiBzb21lIGRyYWdnZWQgZmlsZXMgd291bGQgYmUgcmVqZWN0ZWQuIEFmdGVyIGRyb3AsIHRoaXMgcmVzZXRzIHRvIGZhbHNlLiBVc2UgZmlsZVJlamVjdGlvbnMgZm9yIHBvc3QtZHJvcCBlcnJvcnMuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRHJhZ0dsb2JhbCBGaWxlcyBhcmUgYmVpbmcgZHJhZ2dlZCBhbnl3aGVyZSBvbiB0aGUgZG9jdW1lbnRcbiAqIEBwcm9wZXJ0eSB7RmlsZVtdfSBhY2NlcHRlZEZpbGVzIEFjY2VwdGVkIGZpbGVzXG4gKiBAcHJvcGVydHkge0ZpbGVSZWplY3Rpb25bXX0gZmlsZVJlamVjdGlvbnMgUmVqZWN0ZWQgZmlsZXMgYW5kIHdoeSB0aGV5IHdlcmUgcmVqZWN0ZWQuIFRoaXMgcGVyc2lzdHMgYWZ0ZXIgZHJvcCBhbmQgaXMgdGhlIHNvdXJjZSBvZiB0cnV0aCBmb3IgcG9zdC1kcm9wIHJlamVjdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3Qgd2l0aCB0aGUgZHJvcHpvbmUgbWV0aG9kcy5cbiAqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBEcm9wem9uZU1ldGhvZHNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGdldFJvb3RQcm9wcyBSZXR1cm5zIHRoZSBwcm9wcyB5b3Ugc2hvdWxkIGFwcGx5IHRvIHRoZSByb290IGRyb3AgY29udGFpbmVyIHlvdSByZW5kZXJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGdldElucHV0UHJvcHMgUmV0dXJucyB0aGUgcHJvcHMgeW91IHNob3VsZCBhcHBseSB0byBoaWRkZW4gZmlsZSBpbnB1dCB5b3UgcmVuZGVyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvcGVuIE9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2dcbiAqL1xuXG52YXIgaW5pdGlhbFN0YXRlID0ge1xuICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICBpc0ZpbGVEaWFsb2dBY3RpdmU6IGZhbHNlLFxuICBpc0RyYWdBY3RpdmU6IGZhbHNlLFxuICBpc0RyYWdBY2NlcHQ6IGZhbHNlLFxuICBpc0RyYWdSZWplY3Q6IGZhbHNlLFxuICBpc0RyYWdHbG9iYWw6IGZhbHNlLFxuICBhY2NlcHRlZEZpbGVzOiBbXSxcbiAgZmlsZVJlamVjdGlvbnM6IFtdXG59O1xuLyoqXG4gKiBBIFJlYWN0IGhvb2sgdGhhdCBjcmVhdGVzIGEgZHJhZyAnbicgZHJvcCBhcmVhLlxuICpcbiAqIGBgYGpzeFxuICogZnVuY3Rpb24gTXlEcm9wem9uZShwcm9wcykge1xuICogICBjb25zdCB7Z2V0Um9vdFByb3BzLCBnZXRJbnB1dFByb3BzfSA9IHVzZURyb3B6b25lKHtcbiAqICAgICBvbkRyb3A6IGFjY2VwdGVkRmlsZXMgPT4ge1xuICogICAgICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIEZpbGUgb2JqZWN0cywgZS5nLiB1cGxvYWQgdG8gc29tZSBzZXJ2ZXJcbiAqICAgICB9XG4gKiAgIH0pO1xuICogICByZXR1cm4gKFxuICogICAgIDxkaXYgey4uLmdldFJvb3RQcm9wcygpfT5cbiAqICAgICAgIDxpbnB1dCB7Li4uZ2V0SW5wdXRQcm9wcygpfSAvPlxuICogICAgICAgPHA+RHJhZyBhbmQgZHJvcCBzb21lIGZpbGVzIGhlcmUsIG9yIGNsaWNrIHRvIHNlbGVjdCBmaWxlczwvcD5cbiAqICAgICA8L2Rpdj5cbiAqICAgKVxuICogfVxuICogYGBgXG4gKlxuICogQGZ1bmN0aW9uIHVzZURyb3B6b25lXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge2ltcG9ydChcIi4vdXRpbHNcIikuQWNjZXB0UHJvcH0gW3Byb3BzLmFjY2VwdF0gU2V0IGFjY2VwdGVkIGZpbGUgdHlwZXMuXG4gKiBDaGVja291dCBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3Nob3dPcGVuRmlsZVBpY2tlciB0eXBlcyBvcHRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKiBLZWVwIGluIG1pbmQgdGhhdCBtaW1lIHR5cGUgZGV0ZXJtaW5hdGlvbiBpcyBub3QgcmVsaWFibGUgYWNyb3NzIHBsYXRmb3Jtcy4gQ1NWIGZpbGVzLFxuICogZm9yIGV4YW1wbGUsIGFyZSByZXBvcnRlZCBhcyB0ZXh0L3BsYWluIHVuZGVyIG1hY09TIGJ1dCBhcyBhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwgdW5kZXJcbiAqIFdpbmRvd3MuIEluIHNvbWUgY2FzZXMgdGhlcmUgbWlnaHQgbm90IGJlIGEgbWltZSB0eXBlIHNldCBhdCBhbGwgKGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdC1kcm9wem9uZS9yZWFjdC1kcm9wem9uZS9pc3N1ZXMvMjc2KS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm11bHRpcGxlPXRydWVdIEFsbG93IGRyYWcgJ24nIGRyb3AgKG9yIHNlbGVjdGlvbiBmcm9tIHRoZSBmaWxlIGRpYWxvZykgb2YgbXVsdGlwbGUgZmlsZXNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLnByZXZlbnREcm9wT25Eb2N1bWVudD10cnVlXSBJZiBmYWxzZSwgYWxsb3cgZHJvcHBlZCBpdGVtcyB0byB0YWtlIG92ZXIgdGhlIGN1cnJlbnQgYnJvd3NlciB3aW5kb3dcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vQ2xpY2s9ZmFsc2VdIElmIHRydWUsIGRpc2FibGVzIGNsaWNrIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2dcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vS2V5Ym9hcmQ9ZmFsc2VdIElmIHRydWUsIGRpc2FibGVzIFNQQUNFL0VOVEVSIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2cuXG4gKiBOb3RlIHRoYXQgaXQgYWxzbyBzdG9wcyB0cmFja2luZyB0aGUgZm9jdXMgc3RhdGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5ub0RyYWc9ZmFsc2VdIElmIHRydWUsIGRpc2FibGVzIGRyYWcgJ24nIGRyb3BcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vRHJhZ0V2ZW50c0J1YmJsaW5nPWZhbHNlXSBJZiB0cnVlLCBzdG9wcyBkcmFnIGV2ZW50IHByb3BhZ2F0aW9uIHRvIHBhcmVudHNcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJvcHMubWluU2l6ZT0wXSBNaW5pbXVtIGZpbGUgc2l6ZSAoaW4gYnl0ZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gW3Byb3BzLm1heFNpemU9SW5maW5pdHldIE1heGltdW0gZmlsZSBzaXplIChpbiBieXRlcylcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLmRpc2FibGVkPWZhbHNlXSBFbmFibGUvZGlzYWJsZSB0aGUgZHJvcHpvbmVcbiAqIEBwYXJhbSB7Z2V0RmlsZXNGcm9tRXZlbnR9IFtwcm9wcy5nZXRGaWxlc0Zyb21FdmVudF0gVXNlIHRoaXMgdG8gcHJvdmlkZSBhIGN1c3RvbSBmaWxlIGFnZ3JlZ2F0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wcy5vbkZpbGVEaWFsb2dDYW5jZWxdIENiIGZvciB3aGVuIGNsb3NpbmcgdGhlIGZpbGUgZGlhbG9nIHdpdGggbm8gc2VsZWN0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy51c2VGc0FjY2Vzc0FwaV0gU2V0IHRvIHRydWUgdG8gdXNlIHRoZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZV9TeXN0ZW1fQWNjZXNzX0FQSVxuICogdG8gb3BlbiB0aGUgZmlsZSBwaWNrZXIgaW5zdGVhZCBvZiB1c2luZyBhbiBgPGlucHV0IHR5cGU9XCJmaWxlXCI+YCBjbGljayBldmVudC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0ZvY3VzIFNldCB0byB0cnVlIHRvIGF1dG8gZm9jdXMgdGhlIHJvb3QgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wcy5vbkZpbGVEaWFsb2dPcGVuXSBDYiBmb3Igd2hlbiBvcGVuaW5nIHRoZSBmaWxlIGRpYWxvZ1xuICogQHBhcmFtIHtkcmFnQ2J9IFtwcm9wcy5vbkRyYWdFbnRlcl0gQ2IgZm9yIHdoZW4gdGhlIGBkcmFnZW50ZXJgIGV2ZW50IG9jY3Vycy5cbiAqIEBwYXJhbSB7ZHJhZ0NifSBbcHJvcHMub25EcmFnTGVhdmVdIENiIGZvciB3aGVuIHRoZSBgZHJhZ2xlYXZlYCBldmVudCBvY2N1cnNcbiAqIEBwYXJhbSB7ZHJhZ0NifSBbcHJvcHMub25EcmFnT3Zlcl0gQ2IgZm9yIHdoZW4gdGhlIGBkcmFnb3ZlcmAgZXZlbnQgb2NjdXJzXG4gKiBAcGFyYW0ge2Ryb3BDYn0gW3Byb3BzLm9uRHJvcF0gQ2IgZm9yIHdoZW4gdGhlIGBkcm9wYCBldmVudCBvY2N1cnMuXG4gKiBOb3RlIHRoYXQgdGhpcyBjYWxsYmFjayBpcyBpbnZva2VkIGFmdGVyIHRoZSBgZ2V0RmlsZXNGcm9tRXZlbnRgIGNhbGxiYWNrIGlzIGRvbmUuXG4gKlxuICogRmlsZXMgYXJlIGFjY2VwdGVkIG9yIHJlamVjdGVkIGJhc2VkIG9uIHRoZSBgYWNjZXB0YCwgYG11bHRpcGxlYCwgYG1pblNpemVgIGFuZCBgbWF4U2l6ZWAgcHJvcHMuXG4gKiBgYWNjZXB0YCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGtleXMgYXMgYSB2YWxpZCBbTUlNRSB0eXBlXShodHRwOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL21lZGlhLXR5cGVzL21lZGlhLXR5cGVzLnhodG1sKSBhY2NvcmRpbmcgdG8gW2lucHV0IGVsZW1lbnQgc3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly93d3cudzMub3JnL3dpa2kvSFRNTC9FbGVtZW50cy9pbnB1dC9maWxlKSBhbmQgdGhlIHZhbHVlIGFuIGFycmF5IG9mIGZpbGUgZXh0ZW5zaW9ucyAob3B0aW9uYWwpLlxuICogSWYgYG11bHRpcGxlYCBpcyBzZXQgdG8gZmFsc2UgYW5kIGFkZGl0aW9uYWwgZmlsZXMgYXJlIGRyb3BwZWQsXG4gKiBhbGwgZmlsZXMgYmVzaWRlcyB0aGUgZmlyc3Qgd2lsbCBiZSByZWplY3RlZC5cbiAqIEFueSBmaWxlIHdoaWNoIGRvZXMgbm90IGhhdmUgYSBzaXplIGluIHRoZSBbYG1pblNpemVgLCBgbWF4U2l6ZWBdIHJhbmdlLCB3aWxsIGJlIHJlamVjdGVkIGFzIHdlbGwuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBgb25Ecm9wYCBjYWxsYmFjayB3aWxsIGFsd2F5cyBiZSBpbnZva2VkIHJlZ2FyZGxlc3MgaWYgdGhlIGRyb3BwZWQgZmlsZXMgd2VyZSBhY2NlcHRlZCBvciByZWplY3RlZC5cbiAqIElmIHlvdSdkIGxpa2UgdG8gcmVhY3QgdG8gYSBzcGVjaWZpYyBzY2VuYXJpbywgdXNlIHRoZSBgb25Ecm9wQWNjZXB0ZWRgL2BvbkRyb3BSZWplY3RlZGAgcHJvcHMuXG4gKlxuICogVGhlIHNlY29uZCBwYXJhbWV0ZXIgKGZpbGVSZWplY3Rpb25zKSBpcyB0aGUgYXV0aG9yaXRhdGl2ZSBsaXN0IG9mIHJlamVjdGVkIGZpbGVzIGFmdGVyIGEgZHJvcC5cbiAqIFVzZSB0aGlzIHBhcmFtZXRlciBvciB0aGUgZmlsZVJlamVjdGlvbnMgc3RhdGUgcHJvcGVydHkgdG8gaGFuZGxlIHBvc3QtZHJvcCBmaWxlIHJlamVjdGlvbnMsXG4gKiBhcyBpc0RyYWdSZWplY3Qgb25seSBpbmRpY2F0ZXMgcmVqZWN0aW9uIHN0YXRlIGR1cmluZyBhY3RpdmUgZHJhZyBvcGVyYXRpb25zLlxuICpcbiAqIGBvbkRyb3BgIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhbiBhcnJheSBvZiBbRmlsZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGUpIG9iamVjdHMgd2hpY2ggeW91IGNhbiB0aGVuIHByb2Nlc3MgYW5kIHNlbmQgdG8gYSBzZXJ2ZXIuXG4gKiBGb3IgZXhhbXBsZSwgd2l0aCBbU3VwZXJBZ2VudF0oaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3N1cGVyYWdlbnQpIGFzIGEgaHR0cC9hamF4IGxpYnJhcnk6XG4gKlxuICogYGBganNcbiAqIGZ1bmN0aW9uIG9uRHJvcChhY2NlcHRlZEZpbGVzKSB7XG4gKiAgIGNvbnN0IHJlcSA9IHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIGFjY2VwdGVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAqICAgICByZXEuYXR0YWNoKGZpbGUubmFtZSwgZmlsZSlcbiAqICAgfSlcbiAqICAgcmVxLmVuZChjYWxsYmFjaylcbiAqIH1cbiAqIGBgYFxuICogQHBhcmFtIHtkcm9wQWNjZXB0ZWRDYn0gW3Byb3BzLm9uRHJvcEFjY2VwdGVkXVxuICogQHBhcmFtIHtkcm9wUmVqZWN0ZWRDYn0gW3Byb3BzLm9uRHJvcFJlamVjdGVkXVxuICogQHBhcmFtIHsoZXJyb3I6IEVycm9yKSA9PiB2b2lkfSBbcHJvcHMub25FcnJvcl1cbiAqXG4gKiBAcmV0dXJucyB7RHJvcHpvbmVTdGF0ZSAmIERyb3B6b25lTWV0aG9kc31cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRHJvcHpvbmUoKSB7XG4gIHZhciBwcm9wcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIF9kZWZhdWx0UHJvcHMkcHJvcHMgPSBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIGRlZmF1bHRQcm9wcyksIHByb3BzKSxcbiAgICAgIGFjY2VwdCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMuYWNjZXB0LFxuICAgICAgZGlzYWJsZWQgPSBfZGVmYXVsdFByb3BzJHByb3BzLmRpc2FibGVkLFxuICAgICAgZ2V0RmlsZXNGcm9tRXZlbnQgPSBfZGVmYXVsdFByb3BzJHByb3BzLmdldEZpbGVzRnJvbUV2ZW50LFxuICAgICAgbWF4U2l6ZSA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubWF4U2l6ZSxcbiAgICAgIG1pblNpemUgPSBfZGVmYXVsdFByb3BzJHByb3BzLm1pblNpemUsXG4gICAgICBtdWx0aXBsZSA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubXVsdGlwbGUsXG4gICAgICBtYXhGaWxlcyA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubWF4RmlsZXMsXG4gICAgICBvbkRyYWdFbnRlciA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25EcmFnRW50ZXIsXG4gICAgICBvbkRyYWdMZWF2ZSA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25EcmFnTGVhdmUsXG4gICAgICBvbkRyYWdPdmVyID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkRyYWdPdmVyLFxuICAgICAgb25Ecm9wID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkRyb3AsXG4gICAgICBvbkRyb3BBY2NlcHRlZCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25Ecm9wQWNjZXB0ZWQsXG4gICAgICBvbkRyb3BSZWplY3RlZCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25Ecm9wUmVqZWN0ZWQsXG4gICAgICBvbkZpbGVEaWFsb2dDYW5jZWwgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRmlsZURpYWxvZ0NhbmNlbCxcbiAgICAgIG9uRmlsZURpYWxvZ09wZW4gPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRmlsZURpYWxvZ09wZW4sXG4gICAgICB1c2VGc0FjY2Vzc0FwaSA9IF9kZWZhdWx0UHJvcHMkcHJvcHMudXNlRnNBY2Nlc3NBcGksXG4gICAgICBhdXRvRm9jdXMgPSBfZGVmYXVsdFByb3BzJHByb3BzLmF1dG9Gb2N1cyxcbiAgICAgIHByZXZlbnREcm9wT25Eb2N1bWVudCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMucHJldmVudERyb3BPbkRvY3VtZW50LFxuICAgICAgbm9DbGljayA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubm9DbGljayxcbiAgICAgIG5vS2V5Ym9hcmQgPSBfZGVmYXVsdFByb3BzJHByb3BzLm5vS2V5Ym9hcmQsXG4gICAgICBub0RyYWcgPSBfZGVmYXVsdFByb3BzJHByb3BzLm5vRHJhZyxcbiAgICAgIG5vRHJhZ0V2ZW50c0J1YmJsaW5nID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5ub0RyYWdFdmVudHNCdWJibGluZyxcbiAgICAgIG9uRXJyb3IgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRXJyb3IsXG4gICAgICB2YWxpZGF0b3IgPSBfZGVmYXVsdFByb3BzJHByb3BzLnZhbGlkYXRvcjtcblxuICB2YXIgYWNjZXB0QXR0ciA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhY2NlcHRQcm9wQXNBY2NlcHRBdHRyKGFjY2VwdCk7XG4gIH0sIFthY2NlcHRdKTtcbiAgdmFyIHBpY2tlclR5cGVzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHBpY2tlck9wdGlvbnNGcm9tQWNjZXB0KGFjY2VwdCk7XG4gIH0sIFthY2NlcHRdKTtcbiAgdmFyIG9uRmlsZURpYWxvZ09wZW5DYiA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlb2Ygb25GaWxlRGlhbG9nT3BlbiA9PT0gXCJmdW5jdGlvblwiID8gb25GaWxlRGlhbG9nT3BlbiA6IG5vb3A7XG4gIH0sIFtvbkZpbGVEaWFsb2dPcGVuXSk7XG4gIHZhciBvbkZpbGVEaWFsb2dDYW5jZWxDYiA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlb2Ygb25GaWxlRGlhbG9nQ2FuY2VsID09PSBcImZ1bmN0aW9uXCIgPyBvbkZpbGVEaWFsb2dDYW5jZWwgOiBub29wO1xuICB9LCBbb25GaWxlRGlhbG9nQ2FuY2VsXSk7XG4gIC8qKlxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge1JlYWN0Lk11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQ+fVxuICAgKi9cblxuICB2YXIgcm9vdFJlZiA9IHVzZVJlZihudWxsKTtcbiAgdmFyIGlucHV0UmVmID0gdXNlUmVmKG51bGwpO1xuXG4gIHZhciBfdXNlUmVkdWNlciA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlKSxcbiAgICAgIF91c2VSZWR1Y2VyMiA9IF9zbGljZWRUb0FycmF5KF91c2VSZWR1Y2VyLCAyKSxcbiAgICAgIHN0YXRlID0gX3VzZVJlZHVjZXIyWzBdLFxuICAgICAgZGlzcGF0Y2ggPSBfdXNlUmVkdWNlcjJbMV07XG5cbiAgdmFyIGlzRm9jdXNlZCA9IHN0YXRlLmlzRm9jdXNlZCxcbiAgICAgIGlzRmlsZURpYWxvZ0FjdGl2ZSA9IHN0YXRlLmlzRmlsZURpYWxvZ0FjdGl2ZTtcbiAgdmFyIGZzQWNjZXNzQXBpV29ya3NSZWYgPSB1c2VSZWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cuaXNTZWN1cmVDb250ZXh0ICYmIHVzZUZzQWNjZXNzQXBpICYmIGNhblVzZUZpbGVTeXN0ZW1BY2Nlc3NBUEkoKSk7IC8vIFVwZGF0ZSBmaWxlIGRpYWxvZyBhY3RpdmUgc3RhdGUgd2hlbiB0aGUgd2luZG93IGlzIGZvY3VzZWQgb25cblxuICB2YXIgb25XaW5kb3dGb2N1cyA9IGZ1bmN0aW9uIG9uV2luZG93Rm9jdXMoKSB7XG4gICAgLy8gRXhlY3V0ZSB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBmaWxlIGRpYWxvZyBpcyBvcGVuZWQgaW4gdGhlIGJyb3dzZXJcbiAgICBpZiAoIWZzQWNjZXNzQXBpV29ya3NSZWYuY3VycmVudCAmJiBpc0ZpbGVEaWFsb2dBY3RpdmUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgICAgIHZhciBmaWxlcyA9IGlucHV0UmVmLmN1cnJlbnQuZmlsZXM7XG5cbiAgICAgICAgICBpZiAoIWZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgICB0eXBlOiBcImNsb3NlRGlhbG9nXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb25GaWxlRGlhbG9nQ2FuY2VsQ2IoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDMwMCk7XG4gICAgfVxuICB9O1xuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBvbldpbmRvd0ZvY3VzLCBmYWxzZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgb25XaW5kb3dGb2N1cywgZmFsc2UpO1xuICAgIH07XG4gIH0sIFtpbnB1dFJlZiwgaXNGaWxlRGlhbG9nQWN0aXZlLCBvbkZpbGVEaWFsb2dDYW5jZWxDYiwgZnNBY2Nlc3NBcGlXb3Jrc1JlZl0pO1xuICB2YXIgZHJhZ1RhcmdldHNSZWYgPSB1c2VSZWYoW10pO1xuICB2YXIgZ2xvYmFsRHJhZ1RhcmdldHNSZWYgPSB1c2VSZWYoW10pO1xuXG4gIHZhciBvbkRvY3VtZW50RHJvcCA9IGZ1bmN0aW9uIG9uRG9jdW1lbnREcm9wKGV2ZW50KSB7XG4gICAgaWYgKHJvb3RSZWYuY3VycmVudCAmJiByb290UmVmLmN1cnJlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgLy8gSWYgd2UgaW50ZXJjZXB0ZWQgYW4gZXZlbnQgZm9yIG91ciBpbnN0YW5jZSwgbGV0IGl0IHByb3BhZ2F0ZSBkb3duIHRvIHRoZSBpbnN0YW5jZSdzIG9uRHJvcCBoYW5kbGVyXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gW107XG4gIH07XG5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocHJldmVudERyb3BPbkRvY3VtZW50KSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgb25Eb2N1bWVudERyYWdPdmVyLCBmYWxzZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBvbkRvY3VtZW50RHJvcCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocHJldmVudERyb3BPbkRvY3VtZW50KSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBvbkRvY3VtZW50RHJhZ092ZXIpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBvbkRvY3VtZW50RHJvcCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW3Jvb3RSZWYsIHByZXZlbnREcm9wT25Eb2N1bWVudF0pOyAvLyBUcmFjayBnbG9iYWwgZHJhZyBzdGF0ZSBmb3IgZG9jdW1lbnQtbGV2ZWwgZHJhZyBldmVudHNcblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBvbkRvY3VtZW50RHJhZ0VudGVyID0gZnVuY3Rpb24gb25Eb2N1bWVudERyYWdFbnRlcihldmVudCkge1xuICAgICAgZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudCksIFtldmVudC50YXJnZXRdKTtcblxuICAgICAgaWYgKGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSkge1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgaXNEcmFnR2xvYmFsOiB0cnVlLFxuICAgICAgICAgIHR5cGU6IFwic2V0RHJhZ0dsb2JhbFwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25Eb2N1bWVudERyYWdMZWF2ZSA9IGZ1bmN0aW9uIG9uRG9jdW1lbnREcmFnTGVhdmUoZXZlbnQpIHtcbiAgICAgIC8vIE9ubHkgZGVhY3RpdmF0ZSBvbmNlIHdlJ3ZlIGxlZnQgYWxsIGNoaWxkcmVuXG4gICAgICBnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudC5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBlbCAhPT0gZXZlbnQudGFyZ2V0ICYmIGVsICE9PSBudWxsO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIGlzRHJhZ0dsb2JhbDogZmFsc2UsXG4gICAgICAgIHR5cGU6IFwic2V0RHJhZ0dsb2JhbFwiXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uRG9jdW1lbnREcmFnRW5kID0gZnVuY3Rpb24gb25Eb2N1bWVudERyYWdFbmQoKSB7XG4gICAgICBnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gW107XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIGlzRHJhZ0dsb2JhbDogZmFsc2UsXG4gICAgICAgIHR5cGU6IFwic2V0RHJhZ0dsb2JhbFwiXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uRG9jdW1lbnREcm9wR2xvYmFsID0gZnVuY3Rpb24gb25Eb2N1bWVudERyb3BHbG9iYWwoKSB7XG4gICAgICBnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gW107XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIGlzRHJhZ0dsb2JhbDogZmFsc2UsXG4gICAgICAgIHR5cGU6IFwic2V0RHJhZ0dsb2JhbFwiXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBvbkRvY3VtZW50RHJhZ0VudGVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBvbkRvY3VtZW50RHJhZ0xlYXZlLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgb25Eb2N1bWVudERyYWdFbmQsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBvbkRvY3VtZW50RHJvcEdsb2JhbCwgZmFsc2UpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsIG9uRG9jdW1lbnREcmFnRW50ZXIpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBvbkRvY3VtZW50RHJhZ0xlYXZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsIG9uRG9jdW1lbnREcmFnRW5kKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG9uRG9jdW1lbnREcm9wR2xvYmFsKTtcbiAgICB9O1xuICB9LCBbcm9vdFJlZl0pOyAvLyBBdXRvIGZvY3VzIHRoZSByb290IHdoZW4gYXV0b0ZvY3VzIGlzIHRydWVcblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmICghZGlzYWJsZWQgJiYgYXV0b0ZvY3VzICYmIHJvb3RSZWYuY3VycmVudCkge1xuICAgICAgcm9vdFJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9O1xuICB9LCBbcm9vdFJlZiwgYXV0b0ZvY3VzLCBkaXNhYmxlZF0pO1xuICB2YXIgb25FcnJDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgIG9uRXJyb3IoZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExldCB0aGUgdXNlciBrbm93IHNvbWV0aGluZydzIGdvbmUgd3JvbmcgaWYgdGhleSBoYXZlbid0IHByb3ZpZGVkIHRoZSBvbkVycm9yIGNiLlxuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH0sIFtvbkVycm9yXSk7XG4gIHZhciBvbkRyYWdFbnRlckNiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUGVyc2lzdCBoZXJlIGJlY2F1c2Ugd2UgbmVlZCB0aGUgZXZlbnQgbGF0ZXIgYWZ0ZXIgZ2V0RmlsZXNGcm9tRXZlbnQoKSBpcyBkb25lXG5cbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgc3RvcFByb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShkcmFnVGFyZ2V0c1JlZi5jdXJyZW50KSwgW2V2ZW50LnRhcmdldF0pO1xuXG4gICAgaWYgKGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKGdldEZpbGVzRnJvbUV2ZW50KGV2ZW50KSkudGhlbihmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgaWYgKGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KSAmJiAhbm9EcmFnRXZlbnRzQnViYmxpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZUNvdW50ID0gZmlsZXMubGVuZ3RoO1xuICAgICAgICB2YXIgaXNEcmFnQWNjZXB0ID0gZmlsZUNvdW50ID4gMCAmJiBhbGxGaWxlc0FjY2VwdGVkKHtcbiAgICAgICAgICBmaWxlczogZmlsZXMsXG4gICAgICAgICAgYWNjZXB0OiBhY2NlcHRBdHRyLFxuICAgICAgICAgIG1pblNpemU6IG1pblNpemUsXG4gICAgICAgICAgbWF4U2l6ZTogbWF4U2l6ZSxcbiAgICAgICAgICBtdWx0aXBsZTogbXVsdGlwbGUsXG4gICAgICAgICAgbWF4RmlsZXM6IG1heEZpbGVzLFxuICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgaXNEcmFnUmVqZWN0ID0gZmlsZUNvdW50ID4gMCAmJiAhaXNEcmFnQWNjZXB0O1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgaXNEcmFnQWNjZXB0OiBpc0RyYWdBY2NlcHQsXG4gICAgICAgICAgaXNEcmFnUmVqZWN0OiBpc0RyYWdSZWplY3QsXG4gICAgICAgICAgaXNEcmFnQWN0aXZlOiB0cnVlLFxuICAgICAgICAgIHR5cGU6IFwic2V0RHJhZ2dlZEZpbGVzXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG9uRHJhZ0VudGVyKSB7XG4gICAgICAgICAgb25EcmFnRW50ZXIoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gb25FcnJDYihlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW2dldEZpbGVzRnJvbUV2ZW50LCBvbkRyYWdFbnRlciwgb25FcnJDYiwgbm9EcmFnRXZlbnRzQnViYmxpbmcsIGFjY2VwdEF0dHIsIG1pblNpemUsIG1heFNpemUsIG11bHRpcGxlLCBtYXhGaWxlcywgdmFsaWRhdG9yXSk7XG4gIHZhciBvbkRyYWdPdmVyQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICBzdG9wUHJvcGFnYXRpb24oZXZlbnQpO1xuICAgIHZhciBoYXNGaWxlcyA9IGlzRXZ0V2l0aEZpbGVzKGV2ZW50KTtcblxuICAgIGlmIChoYXNGaWxlcyAmJiBldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XG4gICAgICB9IGNhdGNoIChfdW51c2VkKSB7fVxuICAgICAgLyogZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eSAqL1xuXG4gICAgfVxuXG4gICAgaWYgKGhhc0ZpbGVzICYmIG9uRHJhZ092ZXIpIHtcbiAgICAgIG9uRHJhZ092ZXIoZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSwgW29uRHJhZ092ZXIsIG5vRHJhZ0V2ZW50c0J1YmJsaW5nXSk7XG4gIHZhciBvbkRyYWdMZWF2ZUNiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgc3RvcFByb3BhZ2F0aW9uKGV2ZW50KTsgLy8gT25seSBkZWFjdGl2YXRlIG9uY2UgdGhlIGRyb3B6b25lIGFuZCBhbGwgY2hpbGRyZW4gaGF2ZSBiZWVuIGxlZnRcblxuICAgIHZhciB0YXJnZXRzID0gZHJhZ1RhcmdldHNSZWYuY3VycmVudC5maWx0ZXIoZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgcmV0dXJuIHJvb3RSZWYuY3VycmVudCAmJiByb290UmVmLmN1cnJlbnQuY29udGFpbnModGFyZ2V0KTtcbiAgICB9KTsgLy8gTWFrZSBzdXJlIHRvIHJlbW92ZSBhIHRhcmdldCBwcmVzZW50IG11bHRpcGxlIHRpbWVzIG9ubHkgb25jZVxuICAgIC8vIChGaXJlZm94IG1heSBmaXJlIGRyYWdlbnRlci9kcmFnbGVhdmUgbXVsdGlwbGUgdGltZXMgb24gdGhlIHNhbWUgZWxlbWVudClcblxuICAgIHZhciB0YXJnZXRJZHggPSB0YXJnZXRzLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcblxuICAgIGlmICh0YXJnZXRJZHggIT09IC0xKSB7XG4gICAgICB0YXJnZXRzLnNwbGljZSh0YXJnZXRJZHgsIDEpO1xuICAgIH1cblxuICAgIGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSB0YXJnZXRzO1xuXG4gICAgaWYgKHRhcmdldHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFwic2V0RHJhZ2dlZEZpbGVzXCIsXG4gICAgICBpc0RyYWdBY3RpdmU6IGZhbHNlLFxuICAgICAgaXNEcmFnQWNjZXB0OiBmYWxzZSxcbiAgICAgIGlzRHJhZ1JlamVjdDogZmFsc2VcbiAgICB9KTtcblxuICAgIGlmIChpc0V2dFdpdGhGaWxlcyhldmVudCkgJiYgb25EcmFnTGVhdmUpIHtcbiAgICAgIG9uRHJhZ0xlYXZlKGV2ZW50KTtcbiAgICB9XG4gIH0sIFtyb290UmVmLCBvbkRyYWdMZWF2ZSwgbm9EcmFnRXZlbnRzQnViYmxpbmddKTtcbiAgdmFyIHNldEZpbGVzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGZpbGVzLCBldmVudCkge1xuICAgIHZhciBhY2NlcHRlZEZpbGVzID0gW107XG4gICAgdmFyIGZpbGVSZWplY3Rpb25zID0gW107XG4gICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgdmFyIF9maWxlQWNjZXB0ZWQgPSBmaWxlQWNjZXB0ZWQoZmlsZSwgYWNjZXB0QXR0ciksXG4gICAgICAgICAgX2ZpbGVBY2NlcHRlZDIgPSBfc2xpY2VkVG9BcnJheShfZmlsZUFjY2VwdGVkLCAyKSxcbiAgICAgICAgICBhY2NlcHRlZCA9IF9maWxlQWNjZXB0ZWQyWzBdLFxuICAgICAgICAgIGFjY2VwdEVycm9yID0gX2ZpbGVBY2NlcHRlZDJbMV07XG5cbiAgICAgIHZhciBfZmlsZU1hdGNoU2l6ZSA9IGZpbGVNYXRjaFNpemUoZmlsZSwgbWluU2l6ZSwgbWF4U2l6ZSksXG4gICAgICAgICAgX2ZpbGVNYXRjaFNpemUyID0gX3NsaWNlZFRvQXJyYXkoX2ZpbGVNYXRjaFNpemUsIDIpLFxuICAgICAgICAgIHNpemVNYXRjaCA9IF9maWxlTWF0Y2hTaXplMlswXSxcbiAgICAgICAgICBzaXplRXJyb3IgPSBfZmlsZU1hdGNoU2l6ZTJbMV07XG5cbiAgICAgIHZhciBjdXN0b21FcnJvcnMgPSB2YWxpZGF0b3IgPyB2YWxpZGF0b3IoZmlsZSkgOiBudWxsO1xuXG4gICAgICBpZiAoYWNjZXB0ZWQgJiYgc2l6ZU1hdGNoICYmICFjdXN0b21FcnJvcnMpIHtcbiAgICAgICAgYWNjZXB0ZWRGaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGVycm9ycyA9IFthY2NlcHRFcnJvciwgc2l6ZUVycm9yXTtcblxuICAgICAgICBpZiAoY3VzdG9tRXJyb3JzKSB7XG4gICAgICAgICAgZXJyb3JzID0gZXJyb3JzLmNvbmNhdChjdXN0b21FcnJvcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlsZVJlamVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICBlcnJvcnM6IGVycm9ycy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFtdWx0aXBsZSAmJiBhY2NlcHRlZEZpbGVzLmxlbmd0aCA+IDEgfHwgbXVsdGlwbGUgJiYgbWF4RmlsZXMgPj0gMSAmJiBhY2NlcHRlZEZpbGVzLmxlbmd0aCA+IG1heEZpbGVzKSB7XG4gICAgICAvLyBSZWplY3QgZXZlcnl0aGluZyBhbmQgZW1wdHkgYWNjZXB0ZWQgZmlsZXNcbiAgICAgIGFjY2VwdGVkRmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBmaWxlUmVqZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgIGVycm9yczogW1RPT19NQU5ZX0ZJTEVTX1JFSkVDVElPTl1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGFjY2VwdGVkRmlsZXMuc3BsaWNlKDApO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIGFjY2VwdGVkRmlsZXM6IGFjY2VwdGVkRmlsZXMsXG4gICAgICBmaWxlUmVqZWN0aW9uczogZmlsZVJlamVjdGlvbnMsXG4gICAgICB0eXBlOiBcInNldEZpbGVzXCJcbiAgICB9KTtcblxuICAgIGlmIChvbkRyb3ApIHtcbiAgICAgIG9uRHJvcChhY2NlcHRlZEZpbGVzLCBmaWxlUmVqZWN0aW9ucywgZXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChmaWxlUmVqZWN0aW9ucy5sZW5ndGggPiAwICYmIG9uRHJvcFJlamVjdGVkKSB7XG4gICAgICBvbkRyb3BSZWplY3RlZChmaWxlUmVqZWN0aW9ucywgZXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChhY2NlcHRlZEZpbGVzLmxlbmd0aCA+IDAgJiYgb25Ecm9wQWNjZXB0ZWQpIHtcbiAgICAgIG9uRHJvcEFjY2VwdGVkKGFjY2VwdGVkRmlsZXMsIGV2ZW50KTtcbiAgICB9XG4gIH0sIFtkaXNwYXRjaCwgbXVsdGlwbGUsIGFjY2VwdEF0dHIsIG1pblNpemUsIG1heFNpemUsIG1heEZpbGVzLCBvbkRyb3AsIG9uRHJvcEFjY2VwdGVkLCBvbkRyb3BSZWplY3RlZCwgdmFsaWRhdG9yXSk7XG4gIHZhciBvbkRyb3BDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFBlcnNpc3QgaGVyZSBiZWNhdXNlIHdlIG5lZWQgdGhlIGV2ZW50IGxhdGVyIGFmdGVyIGdldEZpbGVzRnJvbUV2ZW50KCkgaXMgZG9uZVxuXG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHN0b3BQcm9wYWdhdGlvbihldmVudCk7XG4gICAgZHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdO1xuXG4gICAgaWYgKGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKGdldEZpbGVzRnJvbUV2ZW50KGV2ZW50KSkudGhlbihmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgaWYgKGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KSAmJiAhbm9EcmFnRXZlbnRzQnViYmxpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRGaWxlcyhmaWxlcywgZXZlbnQpO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIG9uRXJyQ2IoZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBcInJlc2V0XCJcbiAgICB9KTtcbiAgfSwgW2dldEZpbGVzRnJvbUV2ZW50LCBzZXRGaWxlcywgb25FcnJDYiwgbm9EcmFnRXZlbnRzQnViYmxpbmddKTsgLy8gRm4gZm9yIG9wZW5pbmcgdGhlIGZpbGUgZGlhbG9nIHByb2dyYW1tYXRpY2FsbHlcblxuICB2YXIgb3BlbkZpbGVEaWFsb2cgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgLy8gTm8gcG9pbnQgdG8gdXNlIEZTIGFjY2VzcyBBUElzIGlmIGNvbnRleHQgaXMgbm90IHNlY3VyZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NlY3VyaXR5L1NlY3VyZV9Db250ZXh0cyNmZWF0dXJlX2RldGVjdGlvblxuICAgIGlmIChmc0FjY2Vzc0FwaVdvcmtzUmVmLmN1cnJlbnQpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogXCJvcGVuRGlhbG9nXCJcbiAgICAgIH0pO1xuICAgICAgb25GaWxlRGlhbG9nT3BlbkNiKCk7IC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cvc2hvd09wZW5GaWxlUGlja2VyXG5cbiAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICBtdWx0aXBsZTogbXVsdGlwbGUsXG4gICAgICAgIHR5cGVzOiBwaWNrZXJUeXBlc1xuICAgICAgfTtcbiAgICAgIHdpbmRvdy5zaG93T3BlbkZpbGVQaWNrZXIob3B0cykudGhlbihmdW5jdGlvbiAoaGFuZGxlcykge1xuICAgICAgICByZXR1cm4gZ2V0RmlsZXNGcm9tRXZlbnQoaGFuZGxlcyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChmaWxlcykge1xuICAgICAgICBzZXRGaWxlcyhmaWxlcywgbnVsbCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBcImNsb3NlRGlhbG9nXCJcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBBYm9ydEVycm9yIG1lYW5zIHRoZSB1c2VyIGNhbmNlbGVkXG4gICAgICAgIGlmIChpc0Fib3J0KGUpKSB7XG4gICAgICAgICAgb25GaWxlRGlhbG9nQ2FuY2VsQ2IoZSk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogXCJjbG9zZURpYWxvZ1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTZWN1cml0eUVycm9yKGUpKSB7XG4gICAgICAgICAgZnNBY2Nlc3NBcGlXb3Jrc1JlZi5jdXJyZW50ID0gZmFsc2U7IC8vIENPUlMsIHNvIGNhbm5vdCB1c2UgdGhpcyBBUElcbiAgICAgICAgICAvLyBUcnkgdXNpbmcgdGhlIGlucHV0XG5cbiAgICAgICAgICBpZiAoaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgaW5wdXRSZWYuY3VycmVudC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50LmNsaWNrKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9uRXJyQ2IobmV3IEVycm9yKFwiQ2Fubm90IG9wZW4gdGhlIGZpbGUgcGlja2VyIGJlY2F1c2UgdGhlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlX1N5c3RlbV9BY2Nlc3NfQVBJIGlzIG5vdCBzdXBwb3J0ZWQgYW5kIG5vIDxpbnB1dD4gd2FzIHByb3ZpZGVkLlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uRXJyQ2IoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFwib3BlbkRpYWxvZ1wiXG4gICAgICB9KTtcbiAgICAgIG9uRmlsZURpYWxvZ09wZW5DYigpO1xuICAgICAgaW5wdXRSZWYuY3VycmVudC52YWx1ZSA9IG51bGw7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50LmNsaWNrKCk7XG4gICAgfVxuICB9LCBbZGlzcGF0Y2gsIG9uRmlsZURpYWxvZ09wZW5DYiwgb25GaWxlRGlhbG9nQ2FuY2VsQ2IsIHVzZUZzQWNjZXNzQXBpLCBzZXRGaWxlcywgb25FcnJDYiwgcGlja2VyVHlwZXMsIG11bHRpcGxlXSk7IC8vIENiIHRvIG9wZW4gdGhlIGZpbGUgZGlhbG9nIHdoZW4gU1BBQ0UvRU5URVIgb2NjdXJzIG9uIHRoZSBkcm9wem9uZVxuXG4gIHZhciBvbktleURvd25DYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vIElnbm9yZSBrZXlib2FyZCBldmVudHMgYnViYmxpbmcgdXAgdGhlIERPTSB0cmVlXG4gICAgaWYgKCFyb290UmVmLmN1cnJlbnQgfHwgIXJvb3RSZWYuY3VycmVudC5pc0VxdWFsTm9kZShldmVudC50YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gXCIgXCIgfHwgZXZlbnQua2V5ID09PSBcIkVudGVyXCIgfHwgZXZlbnQua2V5Q29kZSA9PT0gMzIgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBvcGVuRmlsZURpYWxvZygpO1xuICAgIH1cbiAgfSwgW3Jvb3RSZWYsIG9wZW5GaWxlRGlhbG9nXSk7IC8vIFVwZGF0ZSBmb2N1cyBzdGF0ZSBmb3IgdGhlIGRyb3B6b25lXG5cbiAgdmFyIG9uRm9jdXNDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBcImZvY3VzXCJcbiAgICB9KTtcbiAgfSwgW10pO1xuICB2YXIgb25CbHVyQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJibHVyXCJcbiAgICB9KTtcbiAgfSwgW10pOyAvLyBDYiB0byBvcGVuIHRoZSBmaWxlIGRpYWxvZyB3aGVuIGNsaWNrIG9jY3VycyBvbiB0aGUgZHJvcHpvbmVcblxuICB2YXIgb25DbGlja0NiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGlmIChub0NsaWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBJbiBJRTExL0VkZ2UgdGhlIGZpbGUtYnJvd3NlciBkaWFsb2cgaXMgYmxvY2tpbmcsIHRoZXJlZm9yZSwgdXNlIHNldFRpbWVvdXQoKVxuICAgIC8vIHRvIGVuc3VyZSBSZWFjdCBjYW4gaGFuZGxlIHN0YXRlIGNoYW5nZXNcbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdC1kcm9wem9uZS9yZWFjdC1kcm9wem9uZS9pc3N1ZXMvNDUwXG5cblxuICAgIGlmIChpc0llT3JFZGdlKCkpIHtcbiAgICAgIHNldFRpbWVvdXQob3BlbkZpbGVEaWFsb2csIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcGVuRmlsZURpYWxvZygpO1xuICAgIH1cbiAgfSwgW25vQ2xpY2ssIG9wZW5GaWxlRGlhbG9nXSk7XG5cbiAgdmFyIGNvbXBvc2VIYW5kbGVyID0gZnVuY3Rpb24gY29tcG9zZUhhbmRsZXIoZm4pIHtcbiAgICByZXR1cm4gZGlzYWJsZWQgPyBudWxsIDogZm47XG4gIH07XG5cbiAgdmFyIGNvbXBvc2VLZXlib2FyZEhhbmRsZXIgPSBmdW5jdGlvbiBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyKGZuKSB7XG4gICAgcmV0dXJuIG5vS2V5Ym9hcmQgPyBudWxsIDogY29tcG9zZUhhbmRsZXIoZm4pO1xuICB9O1xuXG4gIHZhciBjb21wb3NlRHJhZ0hhbmRsZXIgPSBmdW5jdGlvbiBjb21wb3NlRHJhZ0hhbmRsZXIoZm4pIHtcbiAgICByZXR1cm4gbm9EcmFnID8gbnVsbCA6IGNvbXBvc2VIYW5kbGVyKGZuKTtcbiAgfTtcblxuICB2YXIgc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uKGV2ZW50KSB7XG4gICAgaWYgKG5vRHJhZ0V2ZW50c0J1YmJsaW5nKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldFJvb3RQcm9wcyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3JlZjIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICAgIF9yZWYyJHJlZktleSA9IF9yZWYyLnJlZktleSxcbiAgICAgICAgICByZWZLZXkgPSBfcmVmMiRyZWZLZXkgPT09IHZvaWQgMCA/IFwicmVmXCIgOiBfcmVmMiRyZWZLZXksXG4gICAgICAgICAgcm9sZSA9IF9yZWYyLnJvbGUsXG4gICAgICAgICAgb25LZXlEb3duID0gX3JlZjIub25LZXlEb3duLFxuICAgICAgICAgIG9uRm9jdXMgPSBfcmVmMi5vbkZvY3VzLFxuICAgICAgICAgIG9uQmx1ciA9IF9yZWYyLm9uQmx1cixcbiAgICAgICAgICBvbkNsaWNrID0gX3JlZjIub25DbGljayxcbiAgICAgICAgICBvbkRyYWdFbnRlciA9IF9yZWYyLm9uRHJhZ0VudGVyLFxuICAgICAgICAgIG9uRHJhZ092ZXIgPSBfcmVmMi5vbkRyYWdPdmVyLFxuICAgICAgICAgIG9uRHJhZ0xlYXZlID0gX3JlZjIub25EcmFnTGVhdmUsXG4gICAgICAgICAgb25Ecm9wID0gX3JlZjIub25Ecm9wLFxuICAgICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZjIsIF9leGNsdWRlZDMpO1xuXG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKF9kZWZpbmVQcm9wZXJ0eSh7XG4gICAgICAgIG9uS2V5RG93bjogY29tcG9zZUtleWJvYXJkSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbktleURvd24sIG9uS2V5RG93bkNiKSksXG4gICAgICAgIG9uRm9jdXM6IGNvbXBvc2VLZXlib2FyZEhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25Gb2N1cywgb25Gb2N1c0NiKSksXG4gICAgICAgIG9uQmx1cjogY29tcG9zZUtleWJvYXJkSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkJsdXIsIG9uQmx1ckNiKSksXG4gICAgICAgIG9uQ2xpY2s6IGNvbXBvc2VIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIG9uQ2xpY2tDYikpLFxuICAgICAgICBvbkRyYWdFbnRlcjogY29tcG9zZURyYWdIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRHJhZ0VudGVyLCBvbkRyYWdFbnRlckNiKSksXG4gICAgICAgIG9uRHJhZ092ZXI6IGNvbXBvc2VEcmFnSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkRyYWdPdmVyLCBvbkRyYWdPdmVyQ2IpKSxcbiAgICAgICAgb25EcmFnTGVhdmU6IGNvbXBvc2VEcmFnSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkRyYWdMZWF2ZSwgb25EcmFnTGVhdmVDYikpLFxuICAgICAgICBvbkRyb3A6IGNvbXBvc2VEcmFnSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkRyb3AsIG9uRHJvcENiKSksXG4gICAgICAgIHJvbGU6IHR5cGVvZiByb2xlID09PSBcInN0cmluZ1wiICYmIHJvbGUgIT09IFwiXCIgPyByb2xlIDogXCJwcmVzZW50YXRpb25cIlxuICAgICAgfSwgcmVmS2V5LCByb290UmVmKSwgIWRpc2FibGVkICYmICFub0tleWJvYXJkID8ge1xuICAgICAgICB0YWJJbmRleDogMFxuICAgICAgfSA6IHt9KSwgcmVzdCk7XG4gICAgfTtcbiAgfSwgW3Jvb3RSZWYsIG9uS2V5RG93bkNiLCBvbkZvY3VzQ2IsIG9uQmx1ckNiLCBvbkNsaWNrQ2IsIG9uRHJhZ0VudGVyQ2IsIG9uRHJhZ092ZXJDYiwgb25EcmFnTGVhdmVDYiwgb25Ecm9wQ2IsIG5vS2V5Ym9hcmQsIG5vRHJhZywgZGlzYWJsZWRdKTtcbiAgdmFyIG9uSW5wdXRFbGVtZW50Q2xpY2sgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSwgW10pO1xuICB2YXIgZ2V0SW5wdXRQcm9wcyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3JlZjMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICAgIF9yZWYzJHJlZktleSA9IF9yZWYzLnJlZktleSxcbiAgICAgICAgICByZWZLZXkgPSBfcmVmMyRyZWZLZXkgPT09IHZvaWQgMCA/IFwicmVmXCIgOiBfcmVmMyRyZWZLZXksXG4gICAgICAgICAgb25DaGFuZ2UgPSBfcmVmMy5vbkNoYW5nZSxcbiAgICAgICAgICBvbkNsaWNrID0gX3JlZjMub25DbGljayxcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYzLCBfZXhjbHVkZWQ0KTtcblxuICAgICAgdmFyIGlucHV0UHJvcHMgPSBfZGVmaW5lUHJvcGVydHkoe1xuICAgICAgICBhY2NlcHQ6IGFjY2VwdEF0dHIsXG4gICAgICAgIG11bHRpcGxlOiBtdWx0aXBsZSxcbiAgICAgICAgdHlwZTogXCJmaWxlXCIsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAgIGNsaXA6IFwicmVjdCgwLCAwLCAwLCAwKVwiLFxuICAgICAgICAgIGNsaXBQYXRoOiBcImluc2V0KDUwJSlcIixcbiAgICAgICAgICBoZWlnaHQ6IFwiMXB4XCIsXG4gICAgICAgICAgbWFyZ2luOiBcIjAgLTFweCAtMXB4IDBcIixcbiAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgd2lkdGg6IFwiMXB4XCIsXG4gICAgICAgICAgd2hpdGVTcGFjZTogXCJub3dyYXBcIlxuICAgICAgICB9LFxuICAgICAgICBvbkNoYW5nZTogY29tcG9zZUhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25DaGFuZ2UsIG9uRHJvcENiKSksXG4gICAgICAgIG9uQ2xpY2s6IGNvbXBvc2VIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIG9uSW5wdXRFbGVtZW50Q2xpY2spKSxcbiAgICAgICAgdGFiSW5kZXg6IC0xXG4gICAgICB9LCByZWZLZXksIGlucHV0UmVmKTtcblxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgaW5wdXRQcm9wcyksIHJlc3QpO1xuICAgIH07XG4gIH0sIFtpbnB1dFJlZiwgYWNjZXB0LCBtdWx0aXBsZSwgb25Ecm9wQ2IsIGRpc2FibGVkXSk7XG4gIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICBpc0ZvY3VzZWQ6IGlzRm9jdXNlZCAmJiAhZGlzYWJsZWQsXG4gICAgZ2V0Um9vdFByb3BzOiBnZXRSb290UHJvcHMsXG4gICAgZ2V0SW5wdXRQcm9wczogZ2V0SW5wdXRQcm9wcyxcbiAgICByb290UmVmOiByb290UmVmLFxuICAgIGlucHV0UmVmOiBpbnB1dFJlZixcbiAgICBvcGVuOiBjb21wb3NlSGFuZGxlcihvcGVuRmlsZURpYWxvZylcbiAgfSk7XG59XG4vKipcbiAqIEBwYXJhbSB7RHJvcHpvbmVTdGF0ZX0gc3RhdGVcbiAqIEBwYXJhbSB7e3R5cGU6IHN0cmluZ30gJiBEcm9wem9uZVN0YXRlfSBhY3Rpb25cbiAqIEByZXR1cm5zIHtEcm9wem9uZVN0YXRlfVxuICovXG5cbmZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBcImZvY3VzXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGlzRm9jdXNlZDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwiYmx1clwiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBpc0ZvY3VzZWQ6IGZhbHNlXG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJvcGVuRGlhbG9nXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBpbml0aWFsU3RhdGUpLCB7fSwge1xuICAgICAgICBpc0ZpbGVEaWFsb2dBY3RpdmU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcImNsb3NlRGlhbG9nXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGlzRmlsZURpYWxvZ0FjdGl2ZTogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcInNldERyYWdnZWRGaWxlc1wiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBpc0RyYWdBY3RpdmU6IGFjdGlvbi5pc0RyYWdBY3RpdmUsXG4gICAgICAgIGlzRHJhZ0FjY2VwdDogYWN0aW9uLmlzRHJhZ0FjY2VwdCxcbiAgICAgICAgaXNEcmFnUmVqZWN0OiBhY3Rpb24uaXNEcmFnUmVqZWN0XG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJzZXRGaWxlc1wiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBhY2NlcHRlZEZpbGVzOiBhY3Rpb24uYWNjZXB0ZWRGaWxlcyxcbiAgICAgICAgZmlsZVJlamVjdGlvbnM6IGFjdGlvbi5maWxlUmVqZWN0aW9ucyxcbiAgICAgICAgaXNEcmFnUmVqZWN0OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwic2V0RHJhZ0dsb2JhbFwiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBpc0RyYWdHbG9iYWw6IGFjdGlvbi5pc0RyYWdHbG9iYWxcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcInJlc2V0XCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZCh7fSwgaW5pdGlhbFN0YXRlKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmV4cG9ydCB7IEVycm9yQ29kZSB9IGZyb20gXCIuL3V0aWxzL2luZGV4LmpzXCI7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZURyb3B6b25lIH0gZnJvbSAncmVhY3QtZHJvcHpvbmUnO1xuaW1wb3J0IHsgQm94LCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBJTUFHRV9BQ0NFUFRfTUFQIH0gZnJvbSAnLi4vLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xudHlwZSBJbWFnZVVwbG9hZERyb3B6b25lUHJvcHMgPSB7XG4gIG11bHRpcGxlOiBib29sZWFuO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgb25Ecm9wQWNjZXB0ZWQ6IChmaWxlczogRmlsZVtdKSA9PiB2b2lkO1xufTtcblxuZXhwb3J0IGNvbnN0IEltYWdlVXBsb2FkRHJvcHpvbmU6IFJlYWN0LkZDPEltYWdlVXBsb2FkRHJvcHpvbmVQcm9wcz4gPSAoe1xuICBtdWx0aXBsZSxcbiAgZGlzYWJsZWQsXG4gIG9uRHJvcEFjY2VwdGVkLFxufSkgPT4ge1xuICBjb25zdCB7IGdldFJvb3RQcm9wcywgZ2V0SW5wdXRQcm9wcywgaXNEcmFnQWN0aXZlIH0gPSB1c2VEcm9wem9uZSh7XG4gICAgYWNjZXB0OiBJTUFHRV9BQ0NFUFRfTUFQLFxuICAgIG11bHRpcGxlLFxuICAgIGRpc2FibGVkLFxuICAgIG9uRHJvcEFjY2VwdGVkOiAoYWNjZXB0ZWRGaWxlcykgPT4gdm9pZCBvbkRyb3BBY2NlcHRlZChhY2NlcHRlZEZpbGVzKSxcbiAgICBub0NsaWNrOiBmYWxzZSxcbiAgICBub0tleWJvYXJkOiBmYWxzZSxcbiAgfSk7XG5cbiAgY29uc3QgaGludCA9IGlzRHJhZ0FjdGl2ZVxuICAgID8gJ0Ryb3AgdGhlIGltYWdlcyBoZXJlLi4uJ1xuICAgIDogJ0RyYWcgJiBkcm9wIGltYWdlcyBoZXJlLCBvciBjbGljayB0byBzZWxlY3QnO1xuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgey4uLmdldFJvb3RQcm9wcygpfVxuICAgICAgcGFkZGluZz1cImRlZmF1bHRcIlxuICAgICAgYm9yZGVyPVwiZGVmYXVsdFwiXG4gICAgICBib3JkZXJSYWRpdXM9XCJkZWZhdWx0XCJcbiAgICAgIGJhY2tncm91bmRDb2xvcj17aXNEcmFnQWN0aXZlID8gJ2dyZXkyMCcgOiAnd2hpdGUnfVxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgY3Vyc29yOiBkaXNhYmxlZCA/ICdub3QtYWxsb3dlZCcgOiAncG9pbnRlcicsXG4gICAgICAgIGJvcmRlclN0eWxlOiAnZGFzaGVkJyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8aW5wdXQgey4uLmdldElucHV0UHJvcHMoKX0gLz5cbiAgICAgIDxUZXh0IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiPlxuICAgICAgICB7aGludH1cbiAgICAgIDwvVGV4dD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBMb2FkZXIgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IFVQTE9BRElOR19QUkVWSUVXX1NUWUxFIH0gZnJvbSAnLi4vLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xuXG50eXBlIEltYWdlVXBsb2FkUHJldmlld1N0cmlwUHJvcHMgPSB7XG4gIHByZXZpZXdVcmxzOiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBJbWFnZVVwbG9hZFByZXZpZXdTdHJpcDogUmVhY3QuRkM8XG4gIEltYWdlVXBsb2FkUHJldmlld1N0cmlwUHJvcHNcbj4gPSAoeyBwcmV2aWV3VXJscyB9KSA9PiB7XG4gIGlmIChwcmV2aWV3VXJscy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBtdD1cImRlZmF1bHRcIiBkaXNwbGF5PVwiZmxleFwiIGZsZXhXcmFwPVwid3JhcFwiIGdhcD1cImRlZmF1bHRcIj5cbiAgICAgIHtwcmV2aWV3VXJscy5tYXAoKHVybCkgPT4gKFxuICAgICAgICA8Qm94XG4gICAgICAgICAga2V5PXt1cmx9XG4gICAgICAgICAgcG9zaXRpb249XCJyZWxhdGl2ZVwiXG4gICAgICAgICAgbWI9XCJzbVwiXG4gICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgIGdhcD1cImRlZmF1bHRcIlxuICAgICAgICA+XG4gICAgICAgICAgPGltZyBzcmM9e3VybH0gYWx0PVwiXCIgc3R5bGU9e1VQTE9BRElOR19QUkVWSUVXX1NUWUxFfSAvPlxuICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgIHBvc2l0aW9uPVwiYWJzb2x1dGVcIlxuICAgICAgICAgICAgdG9wPXswfVxuICAgICAgICAgICAgbGVmdD17MH1cbiAgICAgICAgICAgIHJpZ2h0PXswfVxuICAgICAgICAgICAgYm90dG9tPXswfVxuICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuNylcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxMb2FkZXIgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApKX1cbiAgICA8L0JveD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgVGV4dCwgTG9hZGVyIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBUSFVNQl9TSVpFIH0gZnJvbSAnLi4vLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xuXG50eXBlIEltYWdlVXBsb2FkVGh1bWJuYWlsUHJvcHMgPSB7XG4gIHVybDogc3RyaW5nO1xuICB2YXJpYW50OiAnZWRpdCcgfCAnc2hvdyc7XG4gIGluZGV4OiBudW1iZXI7XG4gIG9uUmVtb3ZlPzogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XG59O1xuXG5jb25zdCBDQVJEX1NUWUxFID0ge1xuICB3aWR0aDogVEhVTUJfU0laRSxcbiAgb3ZlcmZsb3c6ICdoaWRkZW4nIGFzIGNvbnN0LFxuICBib3JkZXJSYWRpdXM6IDgsXG4gIGJvcmRlcjogJzFweCBzb2xpZCAjZTBlMGUwJyxcbiAgYmFja2dyb3VuZENvbG9yOiAnI2Y1ZjVmNScsXG59O1xuXG5jb25zdCBJTUdfQ09OVEFJTkVSX1NUWUxFID0ge1xuICB3aWR0aDogVEhVTUJfU0laRSxcbiAgaGVpZ2h0OiBUSFVNQl9TSVpFLFxuICBkaXNwbGF5OiAnYmxvY2snLFxufTtcblxuY29uc3QgSU1HX1NUWUxFID0ge1xuICB3aWR0aDogVEhVTUJfU0laRSxcbiAgaGVpZ2h0OiBUSFVNQl9TSVpFLFxuICBvYmplY3RGaXQ6ICdjb3ZlcicgYXMgY29uc3QsXG4gIGRpc3BsYXk6ICdibG9jaycsXG59O1xuXG50eXBlIFRodW1ibmFpbE92ZXJsYXlTdGF0dXMgPSAnbG9hZGluZycgfCAnbG9hZGVkJyB8ICdlcnJvcic7XG5cbmZ1bmN0aW9uIFRodW1ibmFpbE92ZXJsYXkoeyBzdGF0dXMgfTogeyBzdGF0dXM6IFRodW1ibmFpbE92ZXJsYXlTdGF0dXMgfSkge1xuICBpZiAoc3RhdHVzID09PSAnbG9hZGVkJykgcmV0dXJuIG51bGw7XG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgcG9zaXRpb249XCJhYnNvbHV0ZVwiXG4gICAgICB0b3A9ezB9XG4gICAgICBsZWZ0PXswfVxuICAgICAgcmlnaHQ9ezB9XG4gICAgICBib3R0b209ezB9XG4gICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgIHBhZGRpbmc9XCJkZWZhdWx0XCJcbiAgICAgIGJhY2tncm91bmRDb2xvcj1cImdyZXkyMFwiXG4gICAgPlxuICAgICAge3N0YXR1cyA9PT0gJ2xvYWRpbmcnICYmIDxMb2FkZXIgLz59XG4gICAgICB7c3RhdHVzID09PSAnZXJyb3InICYmIChcbiAgICAgICAgPFRleHQgZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZXJyb3JcIj5cbiAgICAgICAgICBGYWlsZWQgdG8gbG9hZFxuICAgICAgICA8L1RleHQ+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApO1xufVxuXG5leHBvcnQgY29uc3QgSW1hZ2VVcGxvYWRUaHVtYm5haWw6IFJlYWN0LkZDPEltYWdlVXBsb2FkVGh1bWJuYWlsUHJvcHM+ID0gKHtcbiAgdXJsLFxuICB2YXJpYW50LFxuICBpbmRleCxcbiAgb25SZW1vdmUsXG59KSA9PiB7XG4gIGNvbnN0IFtzdGF0dXMsIHNldFN0YXR1c10gPSB1c2VTdGF0ZTxUaHVtYm5haWxPdmVybGF5U3RhdHVzPignbG9hZGluZycpO1xuXG4gIGNvbnN0IGltZyA9IChcbiAgICA8aW1nXG4gICAgICBzcmM9e3VybH1cbiAgICAgIGFsdD1cIlwiXG4gICAgICBzdHlsZT17SU1HX1NUWUxFfVxuICAgICAgb25Mb2FkPXsoKSA9PiBzZXRTdGF0dXMoJ2xvYWRlZCcpfVxuICAgICAgb25FcnJvcj17KCkgPT4gc2V0U3RhdHVzKCdlcnJvcicpfVxuICAgIC8+XG4gICk7XG5cbiAgY29uc3QgaW1hZ2VMaW5rID0gKFxuICAgIDxhXG4gICAgICBocmVmPXt1cmx9XG4gICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBsaW5lSGVpZ2h0OiAwIH19XG4gICAgPlxuICAgICAge2ltZ31cbiAgICA8L2E+XG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHN0eWxlPXtDQVJEX1NUWUxFfT5cbiAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHN0eWxlPXtJTUdfQ09OVEFJTkVSX1NUWUxFfT5cbiAgICAgICAge2ltYWdlTGlua31cbiAgICAgICAgPFRodW1ibmFpbE92ZXJsYXkgc3RhdHVzPXtzdGF0dXN9IC8+XG4gICAgICA8L0JveD5cbiAgICAgIHt2YXJpYW50ID09PSAnZWRpdCcgJiYgb25SZW1vdmUgJiYgKFxuICAgICAgICA8Qm94IHBhZGRpbmc9XCJzbVwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uUmVtb3ZlKGluZGV4KX1cbiAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApO1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEZvcm1Hcm91cCwgTGFiZWwsIFRleHQsIExvYWRlciB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHtcbiAgTEFCRUxTLFxuICBUSFVNQl9HUklEX1NUWUxFLFxufSBmcm9tICcuLi8uLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IEltYWdlVXBsb2FkRmllbGRTdGF0ZSB9IGZyb20gJy4uLy4uL3R5cGVzL2ltYWdlLXVwbG9hZC1maWVsZC50eXBlcyc7XG5pbXBvcnQgeyB1c2VPYmplY3RVcmxzIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlT2JqZWN0VXJscyc7XG5pbXBvcnQgeyBJbWFnZVVwbG9hZERyb3B6b25lIH0gZnJvbSAnLi9JbWFnZVVwbG9hZERyb3B6b25lJztcbmltcG9ydCB7IEltYWdlVXBsb2FkUHJldmlld1N0cmlwIH0gZnJvbSAnLi9JbWFnZVVwbG9hZFByZXZpZXdTdHJpcCc7XG5pbXBvcnQgeyBJbWFnZVVwbG9hZFRodW1ibmFpbCB9IGZyb20gJy4vSW1hZ2VVcGxvYWRUaHVtYm5haWwnO1xuXG50eXBlIEltYWdlVXBsb2FkRmllbGRFZGl0UHJvcHMgPSBJbWFnZVVwbG9hZEZpZWxkU3RhdGU7XG5cbmV4cG9ydCBjb25zdCBJbWFnZVVwbG9hZEZpZWxkRWRpdDogUmVhY3QuRkM8SW1hZ2VVcGxvYWRGaWVsZEVkaXRQcm9wcz4gPSAoe1xuICBmaWVsZCxcbiAgc3RhdHVzLFxuICBhY3Rpb25zLFxufSkgPT4ge1xuICBjb25zdCBwcmV2aWV3VXJscyA9IHVzZU9iamVjdFVybHMoZmllbGQudXBsb2FkaW5nRmlsZXMpO1xuICBjb25zdCBsYWJlbCA9IGZpZWxkLmlzTXVsdGlwbGUgPyBMQUJFTFMucGhvdG9zIDogTEFCRUxTLm1haW5QaG90bztcbiAgY29uc3QgZHJvcHpvbmVEaXNhYmxlZCA9IHN0YXR1cy51cGxvYWRpbmcgfHwgIWZpZWxkLnVwbG9hZFBhdGg7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94PlxuICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgPExhYmVsPntsYWJlbH08L0xhYmVsPlxuICAgICAgICB7ZmllbGQudXBsb2FkUGF0aFByZWZpeCAmJiAhZmllbGQucmVjb3JkSWQgJiYgKFxuICAgICAgICAgIDxUZXh0IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG1iPVwic21cIj5cbiAgICAgICAgICAgIHtmaWVsZC5zYXZlRmlyc3RNZXNzYWdlfVxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cbiAgICAgICAgPEltYWdlVXBsb2FkRHJvcHpvbmVcbiAgICAgICAgICBtdWx0aXBsZT17ZmllbGQuaXNNdWx0aXBsZX1cbiAgICAgICAgICBkaXNhYmxlZD17ZHJvcHpvbmVEaXNhYmxlZH1cbiAgICAgICAgICBvbkRyb3BBY2NlcHRlZD17KGZpbGVzKSA9PiB2b2lkIGFjdGlvbnMuaGFuZGxlRmlsZXMoZmlsZXMpfVxuICAgICAgICAvPlxuICAgICAgICB7c3RhdHVzLnVwbG9hZGluZyAmJiA8TG9hZGVyIC8+fVxuICAgICAgICB7c3RhdHVzLmVycm9yICYmIDxUZXh0IGNvbG9yPVwiZXJyb3JcIj57c3RhdHVzLmVycm9yfTwvVGV4dD59XG4gICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgPEltYWdlVXBsb2FkUHJldmlld1N0cmlwIHByZXZpZXdVcmxzPXtwcmV2aWV3VXJsc30gLz5cblxuICAgICAge2ZpZWxkLnVybHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxCb3ggbXQ9XCJkZWZhdWx0XCIgc3R5bGU9e1RIVU1CX0dSSURfU1RZTEV9PlxuICAgICAgICAgIHtmaWVsZC51cmxzLm1hcCgodXJsLCBpKSA9PiAoXG4gICAgICAgICAgICA8SW1hZ2VVcGxvYWRUaHVtYm5haWxcbiAgICAgICAgICAgICAga2V5PXt1cmx9XG4gICAgICAgICAgICAgIHVybD17dXJsfVxuICAgICAgICAgICAgICB2YXJpYW50PVwiZWRpdFwiXG4gICAgICAgICAgICAgIGluZGV4PXtpfVxuICAgICAgICAgICAgICBvblJlbW92ZT17YWN0aW9ucy5yZW1vdmVVcmx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgVEhVTUJfR1JJRF9TVFlMRSB9IGZyb20gJy4uLy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcbmltcG9ydCB7IEltYWdlVXBsb2FkVGh1bWJuYWlsIH0gZnJvbSAnLi9JbWFnZVVwbG9hZFRodW1ibmFpbCc7XG5cbnR5cGUgSW1hZ2VVcGxvYWRGaWVsZFNob3dQcm9wcyA9IHtcbiAgdXJsczogc3RyaW5nW107XG59O1xuXG5leHBvcnQgY29uc3QgSW1hZ2VVcGxvYWRGaWVsZFNob3c6IFJlYWN0LkZDPEltYWdlVXBsb2FkRmllbGRTaG93UHJvcHM+ID0gKHtcbiAgdXJscyxcbn0pID0+IHtcbiAgaWYgKHVybHMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggc3R5bGU9e1RIVU1CX0dSSURfU1RZTEV9PlxuICAgICAge3VybHMubWFwKCh1cmwsIGkpID0+IChcbiAgICAgICAgPEltYWdlVXBsb2FkVGh1bWJuYWlsIGtleT17dXJsfSB1cmw9e3VybH0gdmFyaWFudD1cInNob3dcIiBpbmRleD17aX0gLz5cbiAgICAgICkpfVxuICAgIDwvQm94PlxuICApO1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VJbWFnZVVwbG9hZEZpZWxkIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlSW1hZ2VVcGxvYWRGaWVsZCc7XG5pbXBvcnQgdHlwZSB7IEltYWdlVXBsb2FkRmllbGRQcm9wcyB9IGZyb20gJy4uLy4uL3R5cGVzL2ltYWdlLXVwbG9hZC1maWVsZC50eXBlcyc7XG5pbXBvcnQgeyBJbWFnZVVwbG9hZEZpZWxkRWRpdCB9IGZyb20gJy4vSW1hZ2VVcGxvYWRGaWVsZEVkaXQnO1xuaW1wb3J0IHsgSW1hZ2VVcGxvYWRGaWVsZFNob3cgfSBmcm9tICcuL0ltYWdlVXBsb2FkRmllbGRTaG93JztcblxuZXhwb3J0IGNvbnN0IEltYWdlVXBsb2FkRmllbGQ6IFJlYWN0LkZDPEltYWdlVXBsb2FkRmllbGRQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyB3aGVyZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHN0YXRlID0gdXNlSW1hZ2VVcGxvYWRGaWVsZChwcm9wcyk7XG5cbiAgaWYgKHdoZXJlID09PSAnZWRpdCcpIHtcbiAgICByZXR1cm4gPEltYWdlVXBsb2FkRmllbGRFZGl0IHsuLi5zdGF0ZX0gLz47XG4gIH1cblxuICBpZiAod2hlcmUgPT09ICdzaG93JyB8fCB3aGVyZSA9PT0gJ2xpc3QnKSB7XG4gICAgcmV0dXJuIDxJbWFnZVVwbG9hZEZpZWxkU2hvdyB1cmxzPXtzdGF0ZS5maWVsZC51cmxzfSAvPjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VVcGxvYWRGaWVsZDtcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IExpbmtzRmllbGQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvTGlua3NGaWVsZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTGlua3NGaWVsZCA9IExpbmtzRmllbGRcbmltcG9ydCBBZGRyZXNzRmllbGQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvQWRkcmVzc0ZpZWxkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5BZGRyZXNzRmllbGQgPSBBZGRyZXNzRmllbGRcbmltcG9ydCBJbWFnZVVwbG9hZEZpZWxkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0ltYWdlVXBsb2FkL0ltYWdlVXBsb2FkRmllbGQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkltYWdlVXBsb2FkRmllbGQgPSBJbWFnZVVwbG9hZEZpZWxkIl0sIm5hbWVzIjpbIkxJTktfS0VZUyIsIkxBQkVMUyIsImZhY2Vib29rIiwiaW5zdGFncmFtIiwiYWlyYm5iIiwiYm9va2luZyIsIndoYXRzYXBwIiwicGFyc2VMaW5rcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5Iiwib2JqIiwicmVkdWNlIiwiYWNjIiwia2V5IiwidiIsInBhcnNlZCIsIkpTT04iLCJwYXJzZSIsImdldExpbmtzRnJvbVBhcmFtcyIsInBhcmFtcyIsInBhdGgiLCJuZXN0ZWQiLCJwcmVmaXgiLCJ1c2VMaW5rc0ZpZWxkIiwicHJvcHMiLCJwcm9wZXJ0eSIsInJlY29yZCIsIm9uQ2hhbmdlIiwibGlua3MiLCJoYW5kbGVDaGFuZ2UiLCJMaW5rSXRlbUVkaXQiLCJsaW5rS2V5IiwiaWQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGb3JtR3JvdXAiLCJtYiIsIkxhYmVsIiwiaHRtbEZvciIsIklucHV0IiwiZSIsInRhcmdldCIsInBsYWNlaG9sZGVyIiwiTGlua0l0ZW1TaG93IiwiQm94IiwibXQiLCJocmVmIiwicmVsIiwiTGlua3NGaWVsZCIsIndoZXJlIiwibWFwIiwiZmlsbGVkIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsIkRFRkFVTFRfQUREUkVTUyIsImxhYmVsIiwidXJsIiwicGFyc2VBZGRyZXNzIiwiZ2V0QWRkcmVzc0Zyb21QYXJhbXMiLCJ1c2VBZGRyZXNzRmllbGQiLCJhZGRyZXNzIiwiZmllbGQiLCJBZGRyZXNzRmllbGQiLCJoYXNWYWx1ZSIsIkJVQ0tFVCIsIm1haW5QaG90byIsInBob3RvcyIsIlVQTE9BRF9VUkwiLCJERUZBVUxUX1NBVkVfRklSU1RfTUVTU0FHRSIsIlVQTE9BRF9FUlJPUl9GQUxMQkFDSyIsIklNQUdFX0FDQ0VQVF9NQVAiLCJUSFVNQl9TSVpFIiwiVEhVTUJfR1JJRF9TVFlMRSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiVVBMT0FESU5HX1BSRVZJRVdfU1RZTEUiLCJtYXhIZWlnaHQiLCJvYmplY3RGaXQiLCJnZXRVcmxzRnJvbVBhcmFtcyIsImlzTXVsdGlwbGUiLCJnZXRBcnJheUZyb21QYXJhbXMiLCJnZXRSZWNvcmRJZCIsInVuZGVmaW5lZCIsImVuc3VyZVN0cmluZ0FycmF5IiwiZGlyZWN0IiwiY29sbGVjdGVkIiwiaSIsInB1c2giLCJidWlsZFVwbG9hZFBhdGgiLCJ1cGxvYWRQYXRoUHJlZml4IiwicmVjb3JkSWQiLCJzZWdtZW50IiwidHJpbSIsInJlcGxhY2UiLCJnZXRFcnJvck1lc3NhZ2UiLCJlcnIiLCJmYWxsYmFjayIsIkVycm9yIiwibWVzc2FnZSIsInVwbG9hZEZpbGUiLCJmaWxlIiwidXBsb2FkUGF0aCIsIlVSTCIsIndpbmRvdyIsImxvY2F0aW9uIiwib3JpZ2luIiwic2VhcmNoUGFyYW1zIiwic2V0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsInJlcyIsImZldGNoIiwidG9TdHJpbmciLCJtZXRob2QiLCJib2R5IiwiY3JlZGVudGlhbHMiLCJvayIsImpzb24iLCJjYXRjaCIsInN0YXR1c1RleHQiLCJkYXRhIiwiZ2V0U3RvcmFnZUtleUZyb21QdWJsaWNVcmwiLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJzbGljZSIsImRlbGV0ZUZpbGVCeVVybCIsImRlbGV0ZVVybCIsInVwbG9hZEZpbGVzQW5kQnVpbGROZXh0VmFsdWUiLCJmaWxlcyIsImN1cnJlbnRVcmxzIiwibGlzdCIsImZyb20iLCJ1cmxzIiwiZ2V0RmllbGRDb25maWciLCJjdXN0b20iLCJzYXZlRmlyc3RNZXNzYWdlIiwidXNlSW1hZ2VVcGxvYWRGaWVsZCIsImNvbmZpZyIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsInVzZVN0YXRlIiwiZXJyb3IiLCJzZXRFcnJvciIsInVwbG9hZGluZ0ZpbGVzIiwic2V0VXBsb2FkaW5nRmlsZXMiLCJoYW5kbGVGaWxlcyIsIm5leHRWYWx1ZSIsInJlbW92ZVVybCIsImluZGV4IiwidXJsVG9SZW1vdmUiLCJuZXh0IiwiXyIsInN0YXR1cyIsImFjdGlvbnMiLCJ1c2VPYmplY3RVcmxzIiwic2V0VXJscyIsInVzZUVmZmVjdCIsImYiLCJjcmVhdGVPYmplY3RVUkwiLCJmb3JFYWNoIiwicmV2b2tlT2JqZWN0VVJMIiwiZXhwb3J0cyIsInRoaXMiLCJyZXF1aXJlJCQwIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiX2FycmF5V2l0aG91dEhvbGVzIiwiX2l0ZXJhYmxlVG9BcnJheSIsIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsIl9ub25JdGVyYWJsZVNwcmVhZCIsIl9hcnJheUxpa2VUb0FycmF5Iiwib3duS2V5cyIsIl9vYmplY3RTcHJlYWQiLCJfZGVmaW5lUHJvcGVydHkiLCJfc2xpY2VkVG9BcnJheSIsIl9hcnJheVdpdGhIb2xlcyIsIl9pdGVyYWJsZVRvQXJyYXlMaW1pdCIsIl9ub25JdGVyYWJsZVJlc3QiLCJmb3J3YXJkUmVmIiwidXNlSW1wZXJhdGl2ZUhhbmRsZSIsIkZyYWdtZW50IiwiZnJvbUV2ZW50IiwiUHJvcFR5cGVzIiwidXNlTWVtbyIsInVzZVJlZiIsInVzZVJlZHVjZXIiLCJ1c2VDYWxsYmFjayIsIkltYWdlVXBsb2FkRHJvcHpvbmUiLCJtdWx0aXBsZSIsImRpc2FibGVkIiwib25Ecm9wQWNjZXB0ZWQiLCJnZXRSb290UHJvcHMiLCJnZXRJbnB1dFByb3BzIiwiaXNEcmFnQWN0aXZlIiwidXNlRHJvcHpvbmUiLCJhY2NlcHQiLCJhY2NlcHRlZEZpbGVzIiwibm9DbGljayIsIm5vS2V5Ym9hcmQiLCJoaW50IiwiX2V4dGVuZHMiLCJwYWRkaW5nIiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwic3R5bGUiLCJjdXJzb3IiLCJib3JkZXJTdHlsZSIsIm1hcmdpbkJvdHRvbSIsIlRleHQiLCJmb250U2l6ZSIsImNvbG9yIiwiSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAiLCJwcmV2aWV3VXJscyIsImZsZXhXcmFwIiwicG9zaXRpb24iLCJhbGlnbkl0ZW1zIiwic3JjIiwiYWx0IiwidG9wIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwianVzdGlmeUNvbnRlbnQiLCJMb2FkZXIiLCJDQVJEX1NUWUxFIiwid2lkdGgiLCJvdmVyZmxvdyIsIklNR19DT05UQUlORVJfU1RZTEUiLCJoZWlnaHQiLCJJTUdfU1RZTEUiLCJUaHVtYm5haWxPdmVybGF5IiwiSW1hZ2VVcGxvYWRUaHVtYm5haWwiLCJ2YXJpYW50Iiwib25SZW1vdmUiLCJzZXRTdGF0dXMiLCJpbWciLCJvbkxvYWQiLCJvbkVycm9yIiwiaW1hZ2VMaW5rIiwibGluZUhlaWdodCIsIkJ1dHRvbiIsInNpemUiLCJvbkNsaWNrIiwiSW1hZ2VVcGxvYWRGaWVsZEVkaXQiLCJkcm9wem9uZURpc2FibGVkIiwiSW1hZ2VVcGxvYWRGaWVsZFNob3ciLCJJbWFnZVVwbG9hZEZpZWxkIiwic3RhdGUiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0VBQU8sTUFBTUEsU0FBUyxHQUFHLENBQ3ZCLFVBQVUsRUFDVixXQUFXLEVBQ1gsUUFBUSxFQUNSLFNBQVMsRUFDVCxVQUFVLENBQ0Y7O0VDSEgsTUFBTUMsUUFBK0IsR0FBRztFQUM3Q0MsRUFBQUEsUUFBUSxFQUFFLFVBQVU7RUFDcEJDLEVBQUFBLFNBQVMsRUFBRSxXQUFXO0VBQ3RCQyxFQUFBQSxNQUFNLEVBQUUsUUFBUTtFQUNoQkMsRUFBQUEsT0FBTyxFQUFFLGFBQWE7RUFDdEJDLEVBQUFBLFFBQVEsRUFBRTtFQUNaLENBQUM7RUFFTSxTQUFTQyxVQUFVQSxDQUFDQyxLQUFjLEVBQWM7RUFDckQsRUFBQSxJQUFJQSxLQUFLLElBQUksSUFBSSxFQUFFLE9BQU8sRUFBRTtFQUM1QixFQUFBLElBQUksT0FBT0EsS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDQyxLQUFLLENBQUNDLE9BQU8sQ0FBQ0YsS0FBSyxDQUFDLEVBQUU7TUFDdEQsTUFBTUcsR0FBRyxHQUFHSCxLQUFnQztNQUM1QyxPQUFPUixTQUFTLENBQUNZLE1BQU0sQ0FBYSxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsS0FBSztFQUNoRCxNQUFBLE1BQU1DLENBQUMsR0FBR0osR0FBRyxDQUFDRyxHQUFHLENBQUM7UUFDbEJELEdBQUcsQ0FBQ0Ms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Q0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0VBQ3BILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztFQUM3RSxJQUFBLENBQUssQ0FBQztFQUNOLENBQUM7RUFDRCxJQUFJLFdBQVcsR0FBRyxDQUFDQSxjQUFJLElBQUlBLGNBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxPQUFPLEVBQUUsSUFBSSxFQUFFO0VBQ3pFLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLEdBQUcsUUFBUSxHQUFHLE1BQU0sRUFBRSxTQUFTLENBQUM7RUFDcE0sSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFF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QUcsRUFBRSxZQUFZLEVBQUUsT0FBTyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBRSxFQUFFLENBQUM7RUFDekg7OztFQ0xBLElBQUEsSUFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFjLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU0sS0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTSxHQUFHLEdBQUcsQ0FBQyxDQUFD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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQzs7RUFFdEwsU0FBUyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FB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QUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxDQUFDOztFQUUzZSxTQUFTLDZCQUE2QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsQ0FBQztFQU9sVDtFQUNBO0VB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
