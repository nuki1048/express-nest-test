(function (React, designSystem, PropTypes) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);
  var PropTypes__default = /*#__PURE__*/_interopDefault(PropTypes);

  const LINK_KEYS = ['facebook', 'instagram', 'airbnb', 'booking'];

  const LABELS$1 = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    airbnb: 'Airbnb',
    booking: 'Booking.com'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvbGlua3MtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlTGlua3NGaWVsZC50cyIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtJdGVtL0xpbmtJdGVtLnRzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtzRmllbGQudHN4IiwiLi4vc3JjL2FkbWluL3V0aWxzL2FkZHJlc3MtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlQWRkcmVzc0ZpZWxkLnRzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvQWRkcmVzc0ZpZWxkLnRzeCIsIi4uL3NyYy91cGxvYWQvY29uc3RhbnRzLnRzIiwiLi4vc3JjL2FkbWluL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzLnRzIiwiLi4vc3JjL2FkbWluL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25maWcudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlSW1hZ2VVcGxvYWRGaWVsZC50cyIsIi4uL3NyYy9hZG1pbi9ob29rcy91c2VPYmplY3RVcmxzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9maWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9maWxlLXNlbGVjdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9hdHRyLWFjY2VwdC9kaXN0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRyb3B6b25lL2Rpc3QvZXMvdXRpbHMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcmVhY3QtZHJvcHpvbmUvZGlzdC9lcy9pbmRleC5qcyIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0ltYWdlVXBsb2FkL0ltYWdlVXBsb2FkRHJvcHpvbmUudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRUaHVtYm5haWwudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZEVkaXQudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZFNob3cudHN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZC50c3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgTElOS19LRVlTID0gW1xuICAnZmFjZWJvb2snLFxuICAnaW5zdGFncmFtJyxcbiAgJ2FpcmJuYicsXG4gICdib29raW5nJyxcbl0gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBMaW5rS2V5ID0gKHR5cGVvZiBMSU5LX0tFWVMpW251bWJlcl07XG5cbmV4cG9ydCB0eXBlIExpbmtzVmFsdWUgPSBQYXJ0aWFsPFJlY29yZDxMaW5rS2V5LCBzdHJpbmc+PjtcblxuZXhwb3J0IHR5cGUgTGlua3NGaWVsZFByb3BzID0ge1xuICBwcm9wZXJ0eTogeyBwYXRoOiBzdHJpbmcgfTtcbiAgcmVjb3JkPzogeyBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9IHwgbnVsbDtcbiAgb25DaGFuZ2U/OiAocGF0aDogc3RyaW5nLCB2YWx1ZTogdW5rbm93bikgPT4gdm9pZDtcbiAgd2hlcmU6ICdzaG93JyB8ICdsaXN0JyB8ICdlZGl0JyB8ICdmaWx0ZXInO1xufTtcbiIsImltcG9ydCB0eXBlIHsgTGlua0tleSwgTGlua3NWYWx1ZSB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcbmltcG9ydCB7IExJTktfS0VZUyB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcblxuZXhwb3J0IGNvbnN0IExBQkVMUzogUmVjb3JkPExpbmtLZXksIHN0cmluZz4gPSB7XG4gIGZhY2Vib29rOiAnRmFjZWJvb2snLFxuICBpbnN0YWdyYW06ICdJbnN0YWdyYW0nLFxuICBhaXJibmI6ICdBaXJibmInLFxuICBib29raW5nOiAnQm9va2luZy5jb20nLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGlua3ModmFsdWU6IHVua25vd24pOiBMaW5rc1ZhbHVlIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiB7fTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgY29uc3Qgb2JqID0gdmFsdWUgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgcmV0dXJuIExJTktfS0VZUy5yZWR1Y2U8TGlua3NWYWx1ZT4oKGFjYywga2V5KSA9PiB7XG4gICAgICBjb25zdCB2ID0gb2JqW2tleV07XG4gICAgICBhY2Nba2V5XSA9IHR5cGVvZiB2ID09PSAnc3RyaW5nJyA/IHYgOiAnJztcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UodmFsdWUpIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgICAgcmV0dXJuIHBhcnNlTGlua3MocGFyc2VkKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG4vKiogR2V0IGxpbmtzIGZyb20gcmVjb3JkLnBhcmFtczogc3VwcG9ydHMgbmVzdGVkIChwYXJhbXMubGlua3MpIG9yIGZsYXR0ZW5lZCAocGFyYW1zWydsaW5rcy5mYWNlYm9vayddKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5rc0Zyb21QYXJhbXMoXG4gIHBhcmFtczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQsXG4gIHBhdGg6IHN0cmluZyxcbik6IExpbmtzVmFsdWUge1xuICBpZiAoIXBhcmFtcykgcmV0dXJuIHt9O1xuICBjb25zdCBuZXN0ZWQgPSBwYXJhbXNbcGF0aF07XG4gIGlmIChuZXN0ZWQgIT0gbnVsbCAmJiB0eXBlb2YgbmVzdGVkID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShuZXN0ZWQpKSB7XG4gICAgcmV0dXJuIHBhcnNlTGlua3MobmVzdGVkKTtcbiAgfVxuICBjb25zdCBwcmVmaXggPSBgJHtwYXRofS5gO1xuICByZXR1cm4gTElOS19LRVlTLnJlZHVjZTxMaW5rc1ZhbHVlPigoYWNjLCBrZXkpID0+IHtcbiAgICBjb25zdCB2ID0gcGFyYW1zW2Ake3ByZWZpeH0ke2tleX1gXTtcbiAgICBhY2Nba2V5XSA9IHR5cGVvZiB2ID09PSAnc3RyaW5nJyA/IHYgOiAnJztcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG4iLCJpbXBvcnQgeyBnZXRMaW5rc0Zyb21QYXJhbXMgfSBmcm9tICcuLi91dGlscy9saW5rcy1maWVsZC51dGlscyc7XG5pbXBvcnQgdHlwZSB7IExpbmtzRmllbGRQcm9wcyB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcbmltcG9ydCB0eXBlIHsgTGlua0tleSB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUxpbmtzRmllbGQocHJvcHM6IExpbmtzRmllbGRQcm9wcykge1xuICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wcztcbiAgY29uc3QgcGF0aCA9IHByb3BlcnR5LnBhdGg7XG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zO1xuICBjb25zdCBsaW5rcyA9IGdldExpbmtzRnJvbVBhcmFtcyhwYXJhbXMsIHBhdGgpO1xuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChrZXk6IExpbmtLZXksIHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIW9uQ2hhbmdlKSByZXR1cm47XG4gICAgb25DaGFuZ2UocGF0aCwgeyAuLi5saW5rcywgW2tleV06IHZhbHVlIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IHBhdGgsIGxpbmtzLCBoYW5kbGVDaGFuZ2UgfTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEZvcm1Hcm91cCwgTGFiZWwsIElucHV0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBMQUJFTFMgfSBmcm9tICcuLi8uLi91dGlscy9saW5rcy1maWVsZC51dGlscyc7XG5pbXBvcnQgdHlwZSB7IExpbmtLZXkgfSBmcm9tICcuLi8uLi90eXBlcy9saW5rcy1maWVsZC50eXBlcyc7XG5cbnR5cGUgTGlua0l0ZW1FZGl0UHJvcHMgPSB7XG4gIHBhdGg6IHN0cmluZztcbiAgbGlua0tleTogTGlua0tleTtcbiAgdmFsdWU6IHN0cmluZztcbiAgb25DaGFuZ2U6IChrZXk6IExpbmtLZXksIHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XG59O1xuXG50eXBlIExpbmtJdGVtU2hvd1Byb3BzID0ge1xuICBsaW5rS2V5OiBMaW5rS2V5O1xuICB2YWx1ZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIExpbmtJdGVtRWRpdCh7XG4gIHBhdGgsXG4gIGxpbmtLZXksXG4gIHZhbHVlLFxuICBvbkNoYW5nZSxcbn06IExpbmtJdGVtRWRpdFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHtcbiAgY29uc3QgaWQgPSBgJHtwYXRofS0ke2xpbmtLZXl9YDtcbiAgcmV0dXJuIChcbiAgICA8Rm9ybUdyb3VwIG1iPVwibGdcIj5cbiAgICAgIDxMYWJlbCBodG1sRm9yPXtpZH0+e0xBQkVMU1tsaW5rS2V5XX08L0xhYmVsPlxuICAgICAgPElucHV0XG4gICAgICAgIGlkPXtpZH1cbiAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgb25DaGFuZ2UobGlua0tleSwgKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIHBsYWNlaG9sZGVyPXtgaHR0cHM6Ly8ke2xpbmtLZXl9LmNvbS8uLi5gfVxuICAgICAgLz5cbiAgICA8L0Zvcm1Hcm91cD5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExpbmtJdGVtU2hvdyh7XG4gIGxpbmtLZXksXG4gIHZhbHVlLFxufTogTGlua0l0ZW1TaG93UHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQge1xuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICA8TGFiZWw+e0xBQkVMU1tsaW5rS2V5XX08L0xhYmVsPlxuICAgICAgPEJveCBtdD1cInNtXCI+XG4gICAgICAgIDxhIGhyZWY9e3ZhbHVlfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICAgICAge3ZhbHVlfVxuICAgICAgICA8L2E+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKTtcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZUxpbmtzRmllbGQgfSBmcm9tICcuLi9ob29rcy91c2VMaW5rc0ZpZWxkJztcbmltcG9ydCB7IExpbmtJdGVtRWRpdCwgTGlua0l0ZW1TaG93IH0gZnJvbSAnLi9MaW5rSXRlbS9MaW5rSXRlbSc7XG5pbXBvcnQgeyBMSU5LX0tFWVMsIExpbmtzRmllbGRQcm9wcyB9IGZyb20gJy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcblxuZXhwb3J0IGNvbnN0IExpbmtzRmllbGQ6IFJlYWN0LkZDPExpbmtzRmllbGRQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyB3aGVyZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHsgcGF0aCwgbGlua3MsIGhhbmRsZUNoYW5nZSB9ID0gdXNlTGlua3NGaWVsZChwcm9wcyk7XG5cbiAgaWYgKHdoZXJlID09PSAnZWRpdCcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJveD5cbiAgICAgICAge0xJTktfS0VZUy5tYXAoKGtleSkgPT4gKFxuICAgICAgICAgIDxMaW5rSXRlbUVkaXRcbiAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgcGF0aD17cGF0aH1cbiAgICAgICAgICAgIGxpbmtLZXk9e2tleX1cbiAgICAgICAgICAgIHZhbHVlPXtsaW5rc1trZXldID8/ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuICAgICk7XG4gIH1cblxuICBpZiAod2hlcmUgPT09ICdzaG93JyB8fCB3aGVyZSA9PT0gJ2xpc3QnKSB7XG4gICAgY29uc3QgZmlsbGVkID0gTElOS19LRVlTLmZpbHRlcigoaykgPT4gbGlua3Nba10pO1xuICAgIGlmIChmaWxsZWQubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gKFxuICAgICAgPEJveD5cbiAgICAgICAge2ZpbGxlZC5tYXAoKGtleSkgPT4gKFxuICAgICAgICAgIDxMaW5rSXRlbVNob3cga2V5PXtrZXl9IGxpbmtLZXk9e2tleX0gdmFsdWU9e2xpbmtzW2tleV0gPz8gJyd9IC8+XG4gICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTGlua3NGaWVsZDtcbiIsImltcG9ydCB0eXBlIHsgQ29udGFjdEFkZHJlc3NWYWx1ZSB9IGZyb20gJy4uL3R5cGVzL2FkZHJlc3MtZmllbGQudHlwZXMnO1xuXG5jb25zdCBERUZBVUxUX0FERFJFU1M6IENvbnRhY3RBZGRyZXNzVmFsdWUgPSB7IGxhYmVsOiAnJywgdXJsOiAnJyB9O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBZGRyZXNzKHZhbHVlOiB1bmtub3duKTogQ29udGFjdEFkZHJlc3NWYWx1ZSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4geyAuLi5ERUZBVUxUX0FERFJFU1MgfTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgY29uc3Qgb2JqID0gdmFsdWUgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiB0eXBlb2Ygb2JqLmxhYmVsID09PSAnc3RyaW5nJyA/IG9iai5sYWJlbCA6ICcnLFxuICAgICAgdXJsOiB0eXBlb2Ygb2JqLnVybCA9PT0gJ3N0cmluZycgPyBvYmoudXJsIDogJycsXG4gICAgfTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHZhbHVlKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICAgIHJldHVybiBwYXJzZUFkZHJlc3MocGFyc2VkKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiB7IC4uLkRFRkFVTFRfQUREUkVTUyB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4geyAuLi5ERUZBVUxUX0FERFJFU1MgfTtcbn1cblxuLyoqIEdldCBhZGRyZXNzIGZyb20gcmVjb3JkLnBhcmFtczogc3VwcG9ydHMgbmVzdGVkIG9yIGZsYXR0ZW5lZCBrZXlzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3NGcm9tUGFyYW1zKFxuICBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkLFxuICBwYXRoOiBzdHJpbmcsXG4pOiBDb250YWN0QWRkcmVzc1ZhbHVlIHtcbiAgaWYgKCFwYXJhbXMpIHJldHVybiB7IC4uLkRFRkFVTFRfQUREUkVTUyB9O1xuICBjb25zdCBuZXN0ZWQgPSBwYXJhbXNbcGF0aF07XG4gIGlmIChuZXN0ZWQgIT0gbnVsbCAmJiB0eXBlb2YgbmVzdGVkID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShuZXN0ZWQpKSB7XG4gICAgcmV0dXJuIHBhcnNlQWRkcmVzcyhuZXN0ZWQpO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IHR5cGVvZiBwYXJhbXNbYCR7cGF0aH0ubGFiZWxgXSA9PT0gJ3N0cmluZycgPyAocGFyYW1zW2Ake3BhdGh9LmxhYmVsYF0gYXMgc3RyaW5nKSA6ICcnLFxuICAgIHVybDogdHlwZW9mIHBhcmFtc1tgJHtwYXRofS51cmxgXSA9PT0gJ3N0cmluZycgPyAocGFyYW1zW2Ake3BhdGh9LnVybGBdIGFzIHN0cmluZykgOiAnJyxcbiAgfTtcbn1cbiIsImltcG9ydCB7IGdldEFkZHJlc3NGcm9tUGFyYW1zIH0gZnJvbSAnLi4vdXRpbHMvYWRkcmVzcy1maWVsZC51dGlscyc7XG5pbXBvcnQgdHlwZSB7IEFkZHJlc3NGaWVsZFByb3BzLCBDb250YWN0QWRkcmVzc1ZhbHVlIH0gZnJvbSAnLi4vdHlwZXMvYWRkcmVzcy1maWVsZC50eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBZGRyZXNzRmllbGQocHJvcHM6IEFkZHJlc3NGaWVsZFByb3BzKSB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzO1xuICBjb25zdCBwYXRoID0gcHJvcGVydHkucGF0aDtcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXM7XG4gIGNvbnN0IGFkZHJlc3MgPSBnZXRBZGRyZXNzRnJvbVBhcmFtcyhwYXJhbXMsIHBhdGgpO1xuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChmaWVsZDoga2V5b2YgQ29udGFjdEFkZHJlc3NWYWx1ZSwgdmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICghb25DaGFuZ2UpIHJldHVybjtcbiAgICBvbkNoYW5nZShwYXRoLCB7IC4uLmFkZHJlc3MsIFtmaWVsZF06IHZhbHVlIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IHBhdGgsIGFkZHJlc3MsIGhhbmRsZUNoYW5nZSB9O1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgRm9ybUdyb3VwLCBMYWJlbCwgSW5wdXQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZUFkZHJlc3NGaWVsZCB9IGZyb20gJy4uL2hvb2tzL3VzZUFkZHJlc3NGaWVsZCc7XG5pbXBvcnQgdHlwZSB7IEFkZHJlc3NGaWVsZFByb3BzIH0gZnJvbSAnLi4vdHlwZXMvYWRkcmVzcy1maWVsZC50eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBBZGRyZXNzRmllbGQ6IFJlYWN0LkZDPEFkZHJlc3NGaWVsZFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHdoZXJlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBwYXRoLCBhZGRyZXNzLCBoYW5kbGVDaGFuZ2UgfSA9IHVzZUFkZHJlc3NGaWVsZChwcm9wcyk7XG5cbiAgaWYgKHdoZXJlID09PSAnZWRpdCcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJveD5cbiAgICAgICAgPEZvcm1Hcm91cCBtYj1cImxnXCI+XG4gICAgICAgICAgPExhYmVsIGh0bWxGb3I9e2Ake3BhdGh9LWxhYmVsYH0+TGFiZWw8L0xhYmVsPlxuICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgaWQ9e2Ake3BhdGh9LWxhYmVsYH1cbiAgICAgICAgICAgIHZhbHVlPXthZGRyZXNzLmxhYmVsfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoJ2xhYmVsJywgKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIEt5aXYsIHZ1bC4gS2hyZXNoY2hhdHlrIDFcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRm9ybUdyb3VwPlxuICAgICAgICA8Rm9ybUdyb3VwIG1iPVwibGdcIj5cbiAgICAgICAgICA8TGFiZWwgaHRtbEZvcj17YCR7cGF0aH0tdXJsYH0+VVJMPC9MYWJlbD5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIGlkPXtgJHtwYXRofS11cmxgfVxuICAgICAgICAgICAgdmFsdWU9e2FkZHJlc3MudXJsfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoJ3VybCcsIChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiaHR0cHM6Ly9tYXBzLmV4YW1wbGUuY29tLy4uLlwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Gb3JtR3JvdXA+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgaWYgKHdoZXJlID09PSAnc2hvdycgfHwgd2hlcmUgPT09ICdsaXN0Jykge1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gYWRkcmVzcy5sYWJlbCB8fCBhZGRyZXNzLnVybDtcbiAgICBpZiAoIWhhc1ZhbHVlKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gKFxuICAgICAgPEJveD5cbiAgICAgICAge2FkZHJlc3MubGFiZWwgJiYgKFxuICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICA8TGFiZWw+TGFiZWw8L0xhYmVsPlxuICAgICAgICAgICAgPEJveCBtdD1cInNtXCI+e2FkZHJlc3MubGFiZWx9PC9Cb3g+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICl9XG4gICAgICAgIHthZGRyZXNzLnVybCAmJiAoXG4gICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgIDxMYWJlbD5VUkw8L0xhYmVsPlxuICAgICAgICAgICAgPEJveCBtdD1cInNtXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWY9e2FkZHJlc3MudXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge2FkZHJlc3MudXJsfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFkZHJlc3NGaWVsZDtcbiIsImltcG9ydCB7IEltYWdlTWltZVR5cGUgfSBmcm9tICcuLi90eXBlcy90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBBTExPV0VEX01JTUVTID0gW1xuICBJbWFnZU1pbWVUeXBlLkpQRUcsXG4gIEltYWdlTWltZVR5cGUuUE5HLFxuICBJbWFnZU1pbWVUeXBlLldFQlAsXG4gIEltYWdlTWltZVR5cGUuR0lGLFxuXSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IE1BWF9TSVpFID0gMTAgKiAxMDI0ICogMTAyNDsgLy8gMTBNQlxuXG5leHBvcnQgY29uc3QgUEFUSF9QQVRURVJOID0gL15bYS16QS1aMC05Xy4tXSsoXFwvW2EtekEtWjAtOV8uLV0rKSskLztcblxuZXhwb3J0IGNvbnN0IEJVQ0tFVCA9ICdhcGFydG1lbnRzJztcbiIsImltcG9ydCB7IEltYWdlTWltZVR5cGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcy90eXBlcyc7XG5cbi8qKiBQdWJsaWMgbGFiZWxzIGZvciB0aGUgZmllbGQuICovXG5leHBvcnQgY29uc3QgTEFCRUxTID0ge1xuICBtYWluUGhvdG86ICdNYWluIHBob3RvJyxcbiAgcGhvdG9zOiAnUGhvdG9zIChtdWx0aXBsZSknLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFVQTE9BRF9VUkwgPSAnL2FwaS91cGxvYWQnO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0FWRV9GSVJTVF9NRVNTQUdFID1cbiAgJ1NhdmUgdGhlIHJlY29yZCBmaXJzdCBzbyBmaWxlcyBhcmUgc3RvcmVkIGluIGl0cyBmb2xkZXIuJztcbmV4cG9ydCBjb25zdCBJTUFHRV9BQ0NFUFQgPSBbXG4gIEltYWdlTWltZVR5cGUuSlBFRyxcbiAgSW1hZ2VNaW1lVHlwZS5QTkcsXG4gIEltYWdlTWltZVR5cGUuV0VCUCxcbiAgSW1hZ2VNaW1lVHlwZS5HSUYsXG5dIGFzIGNvbnN0O1xuZXhwb3J0IGNvbnN0IFVQTE9BRF9FUlJPUl9GQUxMQkFDSyA9ICdVcGxvYWQgZmFpbGVkJztcblxuLyoqIE1JTUUgdHlwZSB0byBleHRlbnNpb25zIG1hcCBmb3IgcmVhY3QtZHJvcHpvbmUgYWNjZXB0LiAqL1xuZXhwb3J0IGNvbnN0IElNQUdFX0FDQ0VQVF9NQVAgPSB7XG4gICdpbWFnZS9qcGVnJzogWycuanBnJywgJy5qcGVnJ10sXG4gICdpbWFnZS9wbmcnOiBbJy5wbmcnXSxcbiAgJ2ltYWdlL3dlYnAnOiBbJy53ZWJwJ10sXG4gICdpbWFnZS9naWYnOiBbJy5naWYnXSxcbn0gYXMgY29uc3Q7XG5cbi8qKiBUaHVtYm5haWwgc2l6ZSBpbiBweDsgdXNlZCBmb3IgZ3JpZCBhbmQgY2FyZCB3aWR0aC4gKi9cbmV4cG9ydCBjb25zdCBUSFVNQl9TSVpFID0gMTYwO1xuXG4vKiogR3JpZCBsYXlvdXQgZm9yIHRodW1ibmFpbCBsaXN0cyAoZWRpdCBhbmQgc2hvdykuICovXG5leHBvcnQgY29uc3QgVEhVTUJfR1JJRF9TVFlMRSA9IHtcbiAgZGlzcGxheTogJ2dyaWQnLFxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDE2MHB4LCAxZnIpKScsXG4gIGdhcDogMTIsXG59IGFzIGNvbnN0O1xuXG4vKiogUHJldmlldyBpbWFnZSBzdHlsZSB3aGlsZSBmaWxlcyBhcmUgdXBsb2FkaW5nLiAqL1xuZXhwb3J0IGNvbnN0IFVQTE9BRElOR19QUkVWSUVXX1NUWUxFID0ge1xuICBtYXhIZWlnaHQ6IDIwMCxcbiAgb2JqZWN0Rml0OiAnY29udGFpbicgYXMgY29uc3QsXG59O1xuIiwiaW1wb3J0IHsgQlVDS0VUIH0gZnJvbSAnLi4vLi4vLi4vdXBsb2FkL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBVUExPQURfVVJMLFxuICBVUExPQURfRVJST1JfRkFMTEJBQ0ssXG59IGZyb20gJy4vaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG5cbi8vIC0tLSBQYXJhbXMgLyByZWNvcmQgaGVscGVycyAtLS1cblxuLyoqXG4gKiBSZWFkIGltYWdlIFVSTChzKSBmcm9tIHJlY29yZCBwYXJhbXMuXG4gKiBBY2NlcHRzIHBhcmFtc1twYXRoXSBhcyBhcnJheSBvciBzdHJpbmcsIGFuZCBwYXJhbXNbcGF0aC4wXSwgcGFyYW1zW3BhdGguMV0sIOKAplxuICogZm9yIGxlZ2FjeSBmb3JtIHBheWxvYWRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXJsc0Zyb21QYXJhbXMoXG4gIHBhcmFtczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQsXG4gIHBhdGg6IHN0cmluZyxcbiAgaXNNdWx0aXBsZTogYm9vbGVhbixcbik6IHN0cmluZ1tdIHtcbiAgaWYgKGlzTXVsdGlwbGUpIHJldHVybiBnZXRBcnJheUZyb21QYXJhbXMocGFyYW1zLCBwYXRoKTtcbiAgY29uc3QgdiA9IHBhcmFtcz8uW3BhdGhdO1xuICByZXR1cm4gdHlwZW9mIHYgPT09ICdzdHJpbmcnICYmIHYgPyBbdl0gOiBbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlY29yZElkKFxuICByZWNvcmQ6IHsgcGFyYW1zPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcztcbiAgcmV0dXJuIHR5cGVvZiBwYXJhbXM/LmlkID09PSAnc3RyaW5nJyA/IHBhcmFtcy5pZCA6IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZW5zdXJlU3RyaW5nQXJyYXkodmFsdWU6IHVua25vd24pOiBzdHJpbmdbXSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS5maWx0ZXIoKHYpOiB2IGlzIHN0cmluZyA9PiB0eXBlb2YgdiA9PT0gJ3N0cmluZycpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlKSByZXR1cm4gW3ZhbHVlXTtcbiAgcmV0dXJuIFtdO1xufVxuXG5mdW5jdGlvbiBnZXRBcnJheUZyb21QYXJhbXMoXG4gIHBhcmFtczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQsXG4gIHBhdGg6IHN0cmluZyxcbik6IHN0cmluZ1tdIHtcbiAgaWYgKCFwYXJhbXMpIHJldHVybiBbXTtcbiAgY29uc3QgZGlyZWN0ID0gcGFyYW1zW3BhdGhdO1xuICBpZiAoQXJyYXkuaXNBcnJheShkaXJlY3QpKSB7XG4gICAgcmV0dXJuIGVuc3VyZVN0cmluZ0FycmF5KGRpcmVjdCk7XG4gIH1cbiAgY29uc3QgY29sbGVjdGVkOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgaSA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBjb25zdCBrZXkgPSBgJHtwYXRofS4ke2l9YDtcbiAgICBjb25zdCB2ID0gcGFyYW1zW2tleV07XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsKSBicmVhaztcbiAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnICYmIHYpIGNvbGxlY3RlZC5wdXNoKHYpO1xuICAgIGkgKz0gMTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGVkO1xufVxuXG4vLyAtLS0gUGF0aCBhbmQgZXJyb3IgaGVscGVycyAtLS1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkVXBsb2FkUGF0aChcbiAgdXBsb2FkUGF0aFByZWZpeDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICByZWNvcmRJZDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdXBsb2FkUGF0aFByZWZpeCB8fCB0eXBlb2YgdXBsb2FkUGF0aFByZWZpeCAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsO1xuICBjb25zdCBzZWdtZW50ID0gKHJlY29yZElkPy50cmltKCkgfHwgJ19uZXcnKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8uLV0vZywgJycpO1xuICBjb25zdCBwcmVmaXggPSB1cGxvYWRQYXRoUHJlZml4LnRyaW0oKS5yZXBsYWNlKC9bXmEtekEtWjAtOV8uLV0vZywgJycpO1xuICByZXR1cm4gcHJlZml4ID8gYCR7cHJlZml4fS8ke3NlZ21lbnR9YCA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoXG4gIGVycjogdW5rbm93bixcbiAgZmFsbGJhY2sgPSBVUExPQURfRVJST1JfRkFMTEJBQ0ssXG4pOiBzdHJpbmcge1xuICByZXR1cm4gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IGZhbGxiYWNrO1xufVxuXG4vLyAtLS0gVXBsb2FkIChzaW5nbGUgaGVscGVyKSAtLS1cblxuYXN5bmMgZnVuY3Rpb24gdXBsb2FkRmlsZShcbiAgZmlsZTogRmlsZSxcbiAgdXBsb2FkUGF0aDogc3RyaW5nIHwgbnVsbCxcbik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHVybCA9IG5ldyBVUkwoVVBMT0FEX1VSTCwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7XG4gIGlmICh1cGxvYWRQYXRoKSB7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3BhdGgnLCB1cGxvYWRQYXRoKTtcbiAgfVxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLnRvU3RyaW5nKCksIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBib2R5OiBmb3JtRGF0YSxcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgfSk7XG5cbiAgaWYgKCFyZXMub2spIHtcbiAgICBjb25zdCBlcnIgPSAoYXdhaXQgcmVzXG4gICAgICAuanNvbigpXG4gICAgICAuY2F0Y2goKCkgPT4gKHsgbWVzc2FnZTogcmVzLnN0YXR1c1RleHQgfSkpKSBhcyB7XG4gICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgIH07XG4gICAgdGhyb3cgbmV3IEVycm9yKGVyci5tZXNzYWdlID8/ICdVcGxvYWQgZmFpbGVkJyk7XG4gIH1cbiAgY29uc3QgZGF0YSA9IChhd2FpdCByZXMuanNvbigpKSBhcyB7IHVybDogc3RyaW5nIH07XG4gIHJldHVybiBkYXRhLnVybDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHN0b3JhZ2Uga2V5IGZyb20gYSBTdXBhYmFzZSBwdWJsaWMgVVJMLlxuICogVVJMIGZvcm1hdDogLi4uL3N0b3JhZ2UvdjEvb2JqZWN0L3B1YmxpYy88YnVja2V0Pi88a2V5PlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RvcmFnZUtleUZyb21QdWJsaWNVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXRobmFtZSA9IG5ldyBVUkwodXJsKS5wYXRobmFtZTtcbiAgICBjb25zdCBwcmVmaXggPSBgL3N0b3JhZ2UvdjEvb2JqZWN0L3B1YmxpYy8ke0JVQ0tFVH0vYDtcbiAgICBpZiAoIXBhdGhuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHBhdGhuYW1lLnNsaWNlKHByZWZpeC5sZW5ndGgpIHx8IG51bGw7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogRGVsZXRlIGEgZmlsZSBmcm9tIHN0b3JhZ2UgYnkgaXRzIHB1YmxpYyBVUkwgKG9ubHkgd29ya3MgZm9yIFN1cGFiYXNlIHB1YmxpYyBVUkxzIGZvciBvdXIgYnVja2V0KS5cbiAqIE5vLW9wIGlmIHRoZSBVUkwgaXMgbm90IGEgdmFsaWQgc3RvcmFnZSBVUkwgKGUuZy4gYmxvYiBVUkwpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlRmlsZUJ5VXJsKHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGtleSA9IGdldFN0b3JhZ2VLZXlGcm9tUHVibGljVXJsKHVybCk7XG4gIGlmICgha2V5KSByZXR1cm47XG4gIGNvbnN0IGRlbGV0ZVVybCA9IG5ldyBVUkwoVVBMT0FEX1VSTCwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7XG4gIGRlbGV0ZVVybC5zZWFyY2hQYXJhbXMuc2V0KCdwYXRoJywga2V5KTtcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goZGVsZXRlVXJsLnRvU3RyaW5nKCksIHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICB9KTtcbiAgaWYgKCFyZXMub2spIHtcbiAgICBjb25zdCBlcnIgPSAoYXdhaXQgcmVzXG4gICAgICAuanNvbigpXG4gICAgICAuY2F0Y2goKCkgPT4gKHsgbWVzc2FnZTogcmVzLnN0YXR1c1RleHQgfSkpKSBhcyB7IG1lc3NhZ2U/OiBzdHJpbmcgfTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UgPz8gJ0RlbGV0ZSBmYWlsZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIFVwbG9hZCBmaWxlcyBhbmQgcmV0dXJuIHRoZSBuZXh0IHZhbHVlIGZvciB0aGUgZmllbGQ6IHNpbmdsZSBVUkwgb3IgYXJyYXkgb2YgVVJMcyBhcHBlbmRlZCB0byBjdXJyZW50VXJscy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZEZpbGVzQW5kQnVpbGROZXh0VmFsdWUoXG4gIGZpbGVzOiBGaWxlTGlzdCB8IEZpbGVbXSxcbiAgdXBsb2FkUGF0aDogc3RyaW5nIHwgbnVsbCxcbiAgaXNNdWx0aXBsZTogYm9vbGVhbixcbiAgY3VycmVudFVybHM6IHN0cmluZ1tdLFxuKTogUHJvbWlzZTxzdHJpbmcgfCBzdHJpbmdbXT4ge1xuICBjb25zdCBsaXN0ID0gQXJyYXkuZnJvbShmaWxlcyk7XG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBpc011bHRpcGxlID8gY3VycmVudFVybHMgOiAnJztcbiAgfVxuICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB1cmxzLnB1c2goYXdhaXQgdXBsb2FkRmlsZShsaXN0W2ldLCB1cGxvYWRQYXRoKSk7XG4gIH1cbiAgaWYgKGlzTXVsdGlwbGUpIHtcbiAgICByZXR1cm4gWy4uLmN1cnJlbnRVcmxzLCAuLi51cmxzXTtcbiAgfVxuICByZXR1cm4gdXJsc1swXTtcbn1cbiIsImltcG9ydCB7IERFRkFVTFRfU0FWRV9GSVJTVF9NRVNTQUdFIH0gZnJvbSAnLi9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgSW1hZ2VVcGxvYWRGaWVsZFByb3BzIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW1hZ2UtdXBsb2FkLWZpZWxkLnR5cGVzJztcbmV4cG9ydCB0eXBlIEZpZWxkQ29uZmlnID0ge1xuICBwYXRoOiBzdHJpbmc7XG4gIGlzTXVsdGlwbGU6IGJvb2xlYW47XG4gIHVwbG9hZFBhdGhQcmVmaXg6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgc2F2ZUZpcnN0TWVzc2FnZTogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBCdWlsZCBmaWVsZCBjb25maWcgZnJvbSBBZG1pbkpTIHByb3BlcnR5LlxuICogTXVsdGlwbGUgdXBsb2FkIGlzIGVuYWJsZWQgd2hlbiBwYXRoIGlzIFwicGhvdG9zXCIgKHVzZWQgZm9yIGFwYXJ0bWVudCBwaG90b3MpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRDb25maWcoXG4gIHByb3BlcnR5OiBJbWFnZVVwbG9hZEZpZWxkUHJvcHNbJ3Byb3BlcnR5J10sXG4pOiBGaWVsZENvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgcGF0aDogcHJvcGVydHkucGF0aCxcbiAgICBpc011bHRpcGxlOiBwcm9wZXJ0eS5wYXRoID09PSAncGhvdG9zJyxcbiAgICB1cGxvYWRQYXRoUHJlZml4OiBwcm9wZXJ0eS5jdXN0b20/LnVwbG9hZFBhdGhQcmVmaXgsXG4gICAgc2F2ZUZpcnN0TWVzc2FnZTpcbiAgICAgIHByb3BlcnR5LmN1c3RvbT8uc2F2ZUZpcnN0TWVzc2FnZSA/PyBERUZBVUxUX1NBVkVfRklSU1RfTUVTU0FHRSxcbiAgfTtcbn1cbiIsImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgYnVpbGRVcGxvYWRQYXRoLFxuICBnZXRVcmxzRnJvbVBhcmFtcyxcbiAgZ2V0UmVjb3JkSWQsXG4gIHVwbG9hZEZpbGVzQW5kQnVpbGROZXh0VmFsdWUsXG4gIGdldEVycm9yTWVzc2FnZSxcbiAgZGVsZXRlRmlsZUJ5VXJsLFxufSBmcm9tICcuLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLnV0aWxzJztcbmltcG9ydCB7IGdldEZpZWxkQ29uZmlnIH0gZnJvbSAnLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25maWcnO1xuaW1wb3J0IHR5cGUgeyBJbWFnZVVwbG9hZEZpZWxkUHJvcHMgfSBmcm9tICcuLi90eXBlcy9pbWFnZS11cGxvYWQtZmllbGQudHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSW1hZ2VVcGxvYWRGaWVsZChwcm9wczogSW1hZ2VVcGxvYWRGaWVsZFByb3BzKSB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzO1xuXG4gIGNvbnN0IGNvbmZpZyA9IGdldEZpZWxkQ29uZmlnKHByb3BlcnR5KTtcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcztcbiAgY29uc3QgcmVjb3JkSWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xuICBjb25zdCB1cGxvYWRQYXRoID0gYnVpbGRVcGxvYWRQYXRoKGNvbmZpZy51cGxvYWRQYXRoUHJlZml4LCByZWNvcmRJZCk7XG4gIGNvbnN0IHVybHMgPSBnZXRVcmxzRnJvbVBhcmFtcyhwYXJhbXMsIGNvbmZpZy5wYXRoLCBjb25maWcuaXNNdWx0aXBsZSk7XG5cbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3VwbG9hZGluZ0ZpbGVzLCBzZXRVcGxvYWRpbmdGaWxlc10gPSB1c2VTdGF0ZTxGaWxlW10+KFtdKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlczogRmlsZVtdKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFmaWxlcy5sZW5ndGggfHwgIW9uQ2hhbmdlKSByZXR1cm47XG5cbiAgICBzZXRFcnJvcihudWxsKTtcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XG4gICAgc2V0VXBsb2FkaW5nRmlsZXMoZmlsZXMpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBuZXh0VmFsdWUgPSBhd2FpdCB1cGxvYWRGaWxlc0FuZEJ1aWxkTmV4dFZhbHVlKFxuICAgICAgICBmaWxlcyxcbiAgICAgICAgdXBsb2FkUGF0aCxcbiAgICAgICAgY29uZmlnLmlzTXVsdGlwbGUsXG4gICAgICAgIHVybHMsXG4gICAgICApO1xuICAgICAgb25DaGFuZ2UoY29uZmlnLnBhdGgsIG5leHRWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZXRFcnJvcihnZXRFcnJvck1lc3NhZ2UoZXJyKSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSk7XG4gICAgICBzZXRVcGxvYWRpbmdGaWxlcyhbXSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbW92ZVVybCA9IChpbmRleDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKCFvbkNoYW5nZSkgcmV0dXJuO1xuICAgIGNvbnN0IHVybFRvUmVtb3ZlID0gdXJsc1tpbmRleF07XG4gICAgaWYgKHVybFRvUmVtb3ZlKSB7XG4gICAgICB2b2lkIGRlbGV0ZUZpbGVCeVVybCh1cmxUb1JlbW92ZSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQ6IGltYWdlIGlzIHJlbW92ZWQgZnJvbSBmb3JtIGVpdGhlciB3YXlcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IG5leHQgPSB1cmxzLmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpO1xuICAgICAgb25DaGFuZ2UoY29uZmlnLnBhdGgsIG5leHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbkNoYW5nZShjb25maWcucGF0aCwgJycpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGZpZWxkOiB7XG4gICAgICBwYXRoOiBjb25maWcucGF0aCxcbiAgICAgIGlzTXVsdGlwbGU6IGNvbmZpZy5pc011bHRpcGxlLFxuICAgICAgdXJscyxcbiAgICAgIHVwbG9hZGluZ0ZpbGVzLFxuICAgICAgdXBsb2FkUGF0aCxcbiAgICAgIHVwbG9hZFBhdGhQcmVmaXg6IGNvbmZpZy51cGxvYWRQYXRoUHJlZml4LFxuICAgICAgcmVjb3JkSWQsXG4gICAgICBzYXZlRmlyc3RNZXNzYWdlOiBjb25maWcuc2F2ZUZpcnN0TWVzc2FnZSxcbiAgICB9LFxuICAgIHN0YXR1czogeyB1cGxvYWRpbmcsIGVycm9yIH0sXG4gICAgYWN0aW9uczogeyBoYW5kbGVGaWxlcywgcmVtb3ZlVXJsIH0sXG4gIH07XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIFJldHVybnMgb2JqZWN0IFVSTHMgZm9yIHRoZSBnaXZlbiBmaWxlcyBhbmQgcmV2b2tlcyB0aGVtIG9uIGNsZWFudXAuXG4gKiBVc2UgZm9yIHByZXZpZXdpbmcgRmlsZSBvYmplY3RzIGJlZm9yZSB1cGxvYWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VPYmplY3RVcmxzKGZpbGVzOiBGaWxlW10pOiBzdHJpbmdbXSB7XG4gIGNvbnN0IFt1cmxzLCBzZXRVcmxzXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZXRVcmxzKFtdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV4dCA9IGZpbGVzLm1hcCgoZikgPT4gVVJMLmNyZWF0ZU9iamVjdFVSTChmKSk7XG4gICAgc2V0VXJscyhuZXh0KTtcbiAgICByZXR1cm4gKCkgPT4gbmV4dC5mb3JFYWNoKCh1cmwpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSk7XG4gIH0sIFtmaWxlc10pO1xuXG4gIHJldHVybiB1cmxzO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNPTU1PTl9NSU1FX1RZUEVTID0gdm9pZCAwO1xuZXhwb3J0cy50b0ZpbGVXaXRoUGF0aCA9IHRvRmlsZVdpdGhQYXRoO1xuZXhwb3J0cy5DT01NT05fTUlNRV9UWVBFUyA9IG5ldyBNYXAoW1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ndXp6bGUvcHNyNy9ibG9iLzJkOTI2MDc5OWU3MTNmMWM0NzVkM2M1ZmRjM2Q2NTYxZmY3NDQxYjIvc3JjL01pbWVUeXBlLnBocFxuICAgIFsnMWttJywgJ2FwcGxpY2F0aW9uL3ZuZC4xMDAwbWluZHMuZGVjaXNpb24tbW9kZWwreG1sJ10sXG4gICAgWyczZG1sJywgJ3RleHQvdm5kLmluM2QuM2RtbCddLFxuICAgIFsnM2RzJywgJ2ltYWdlL3gtM2RzJ10sXG4gICAgWyczZzInLCAndmlkZW8vM2dwcDInXSxcbiAgICBbJzNncCcsICd2aWRlby8zZ3AnXSxcbiAgICBbJzNncHAnLCAndmlkZW8vM2dwcCddLFxuICAgIFsnM21mJywgJ21vZGVsLzNtZiddLFxuICAgIFsnN3onLCAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJ10sXG4gICAgWyc3emlwJywgJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCddLFxuICAgIFsnMTIzJywgJ2FwcGxpY2F0aW9uL3ZuZC5sb3R1cy0xLTItMyddLFxuICAgIFsnYWFiJywgJ2FwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1iaW4nXSxcbiAgICBbJ2FhYycsICdhdWRpby94LWFjYyddLFxuICAgIFsnYWFtJywgJ2FwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1tYXAnXSxcbiAgICBbJ2FhcycsICdhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtc2VnJ10sXG4gICAgWydhYncnLCAnYXBwbGljYXRpb24veC1hYml3b3JkJ10sXG4gICAgWydhYycsICdhcHBsaWNhdGlvbi92bmQubm9raWEubi1nYWdlLmFjK3htbCddLFxuICAgIFsnYWMzJywgJ2F1ZGlvL2FjMyddLFxuICAgIFsnYWNjJywgJ2FwcGxpY2F0aW9uL3ZuZC5hbWVyaWNhbmR5bmFtaWNzLmFjYyddLFxuICAgIFsnYWNlJywgJ2FwcGxpY2F0aW9uL3gtYWNlLWNvbXByZXNzZWQnXSxcbiAgICBbJ2FjdScsICdhcHBsaWNhdGlvbi92bmQuYWN1Y29ib2wnXSxcbiAgICBbJ2FjdXRjJywgJ2FwcGxpY2F0aW9uL3ZuZC5hY3Vjb3JwJ10sXG4gICAgWydhZHAnLCAnYXVkaW8vYWRwY20nXSxcbiAgICBbJ2FlcCcsICdhcHBsaWNhdGlvbi92bmQuYXVkaW9ncmFwaCddLFxuICAgIFsnYWZtJywgJ2FwcGxpY2F0aW9uL3gtZm9udC10eXBlMSddLFxuICAgIFsnYWZwJywgJ2FwcGxpY2F0aW9uL3ZuZC5pYm0ubW9kY2FwJ10sXG4gICAgWydhaGVhZCcsICdhcHBsaWNhdGlvbi92bmQuYWhlYWQuc3BhY2UnXSxcbiAgICBbJ2FpJywgJ2FwcGxpY2F0aW9uL3BkZiddLFxuICAgIFsnYWlmJywgJ2F1ZGlvL3gtYWlmZiddLFxuICAgIFsnYWlmYycsICdhdWRpby94LWFpZmYnXSxcbiAgICBbJ2FpZmYnLCAnYXVkaW8veC1haWZmJ10sXG4gICAgWydhaXInLCAnYXBwbGljYXRpb24vdm5kLmFkb2JlLmFpci1hcHBsaWNhdGlvbi1pbnN0YWxsZXItcGFja2FnZSt6aXAnXSxcbiAgICBbJ2FpdCcsICdhcHBsaWNhdGlvbi92bmQuZHZiLmFpdCddLFxuICAgIFsnYW1pJywgJ2FwcGxpY2F0aW9uL3ZuZC5hbWlnYS5hbWknXSxcbiAgICBbJ2FtcicsICdhdWRpby9hbXInXSxcbiAgICBbJ2FwaycsICdhcHBsaWNhdGlvbi92bmQuYW5kcm9pZC5wYWNrYWdlLWFyY2hpdmUnXSxcbiAgICBbJ2FwbmcnLCAnaW1hZ2UvYXBuZyddLFxuICAgIFsnYXBwY2FjaGUnLCAndGV4dC9jYWNoZS1tYW5pZmVzdCddLFxuICAgIFsnYXBwbGljYXRpb24nLCAnYXBwbGljYXRpb24veC1tcy1hcHBsaWNhdGlvbiddLFxuICAgIFsnYXByJywgJ2FwcGxpY2F0aW9uL3ZuZC5sb3R1cy1hcHByb2FjaCddLFxuICAgIFsnYXJjJywgJ2FwcGxpY2F0aW9uL3gtZnJlZWFyYyddLFxuICAgIFsnYXJqJywgJ2FwcGxpY2F0aW9uL3gtYXJqJ10sXG4gICAgWydhc2MnLCAnYXBwbGljYXRpb24vcGdwLXNpZ25hdHVyZSddLFxuICAgIFsnYXNmJywgJ3ZpZGVvL3gtbXMtYXNmJ10sXG4gICAgWydhc20nLCAndGV4dC94LWFzbSddLFxuICAgIFsnYXNvJywgJ2FwcGxpY2F0aW9uL3ZuZC5hY2NwYWMuc2ltcGx5LmFzbyddLFxuICAgIFsnYXN4JywgJ3ZpZGVvL3gtbXMtYXNmJ10sXG4gICAgWydhdGMnLCAnYXBwbGljYXRpb24vdm5kLmFjdWNvcnAnXSxcbiAgICBbJ2F0b20nLCAnYXBwbGljYXRpb24vYXRvbSt4bWwnXSxcbiAgICBbJ2F0b21jYXQnLCAnYXBwbGljYXRpb24vYXRvbWNhdCt4bWwnXSxcbiAgICBbJ2F0b21kZWxldGVkJywgJ2FwcGxpY2F0aW9uL2F0b21kZWxldGVkK3htbCddLFxuICAgIFsnYXRvbXN2YycsICdhcHBsaWNhdGlvbi9hdG9tc3ZjK3htbCddLFxuICAgIFsnYXR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5hbnRpeC5nYW1lLWNvbXBvbmVudCddLFxuICAgIFsnYXUnLCAnYXVkaW8veC1hdSddLFxuICAgIFsnYXZpJywgJ3ZpZGVvL3gtbXN2aWRlbyddLFxuICAgIFsnYXZpZicsICdpbWFnZS9hdmlmJ10sXG4gICAgWydhdycsICdhcHBsaWNhdGlvbi9hcHBsaXh3YXJlJ10sXG4gICAgWydhemYnLCAnYXBwbGljYXRpb24vdm5kLmFpcnppcC5maWxlc2VjdXJlLmF6ZiddLFxuICAgIFsnYXpzJywgJ2FwcGxpY2F0aW9uL3ZuZC5haXJ6aXAuZmlsZXNlY3VyZS5henMnXSxcbiAgICBbJ2F6dicsICdpbWFnZS92bmQuYWlyemlwLmFjY2VsZXJhdG9yLmF6diddLFxuICAgIFsnYXp3JywgJ2FwcGxpY2F0aW9uL3ZuZC5hbWF6b24uZWJvb2snXSxcbiAgICBbJ2IxNicsICdpbWFnZS92bmQucGNvLmIxNiddLFxuICAgIFsnYmF0JywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCddLFxuICAgIFsnYmNwaW8nLCAnYXBwbGljYXRpb24veC1iY3BpbyddLFxuICAgIFsnYmRmJywgJ2FwcGxpY2F0aW9uL3gtZm9udC1iZGYnXSxcbiAgICBbJ2JkbScsICdhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3dieG1sJ10sXG4gICAgWydiZG9jJywgJ2FwcGxpY2F0aW9uL3gtYmRvYyddLFxuICAgIFsnYmVkJywgJ2FwcGxpY2F0aW9uL3ZuZC5yZWFsdm5jLmJlZCddLFxuICAgIFsnYmgyJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzcHJzJ10sXG4gICAgWydiaW4nLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydibGInLCAnYXBwbGljYXRpb24veC1ibG9yYiddLFxuICAgIFsnYmxvcmInLCAnYXBwbGljYXRpb24veC1ibG9yYiddLFxuICAgIFsnYm1pJywgJ2FwcGxpY2F0aW9uL3ZuZC5ibWknXSxcbiAgICBbJ2JtbWwnLCAnYXBwbGljYXRpb24vdm5kLmJhbHNhbWlxLmJtbWwreG1sJ10sXG4gICAgWydibXAnLCAnaW1hZ2UvYm1wJ10sXG4gICAgWydib29rJywgJ2FwcGxpY2F0aW9uL3ZuZC5mcmFtZW1ha2VyJ10sXG4gICAgWydib3gnLCAnYXBwbGljYXRpb24vdm5kLnByZXZpZXdzeXN0ZW1zLmJveCddLFxuICAgIFsnYm96JywgJ2FwcGxpY2F0aW9uL3gtYnppcDInXSxcbiAgICBbJ2JwaycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2JwbW4nLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydic3AnLCAnbW9kZWwvdm5kLnZhbHZlLnNvdXJjZS5jb21waWxlZC1tYXAnXSxcbiAgICBbJ2J0aWYnLCAnaW1hZ2UvcHJzLmJ0aWYnXSxcbiAgICBbJ2J1ZmZlcicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2J6JywgJ2FwcGxpY2F0aW9uL3gtYnppcCddLFxuICAgIFsnYnoyJywgJ2FwcGxpY2F0aW9uL3gtYnppcDInXSxcbiAgICBbJ2MnLCAndGV4dC94LWMnXSxcbiAgICBbJ2M0ZCcsICdhcHBsaWNhdGlvbi92bmQuY2xvbmsuYzRncm91cCddLFxuICAgIFsnYzRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5jbG9uay5jNGdyb3VwJ10sXG4gICAgWydjNGcnLCAnYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXAnXSxcbiAgICBbJ2M0cCcsICdhcHBsaWNhdGlvbi92bmQuY2xvbmsuYzRncm91cCddLFxuICAgIFsnYzR1JywgJ2FwcGxpY2F0aW9uL3ZuZC5jbG9uay5jNGdyb3VwJ10sXG4gICAgWydjMTFhbWMnLCAnYXBwbGljYXRpb24vdm5kLmNsdWV0cnVzdC5jYXJ0b21vYmlsZS1jb25maWcnXSxcbiAgICBbJ2MxMWFteicsICdhcHBsaWNhdGlvbi92bmQuY2x1ZXRydXN0LmNhcnRvbW9iaWxlLWNvbmZpZy1wa2cnXSxcbiAgICBbJ2NhYicsICdhcHBsaWNhdGlvbi92bmQubXMtY2FiLWNvbXByZXNzZWQnXSxcbiAgICBbJ2NhZicsICdhdWRpby94LWNhZiddLFxuICAgIFsnY2FwJywgJ2FwcGxpY2F0aW9uL3ZuZC50Y3BkdW1wLnBjYXAnXSxcbiAgICBbJ2NhcicsICdhcHBsaWNhdGlvbi92bmQuY3VybC5jYXInXSxcbiAgICBbJ2NhdCcsICdhcHBsaWNhdGlvbi92bmQubXMtcGtpLnNlY2NhdCddLFxuICAgIFsnY2I3JywgJ2FwcGxpY2F0aW9uL3gtY2JyJ10sXG4gICAgWydjYmEnLCAnYXBwbGljYXRpb24veC1jYnInXSxcbiAgICBbJ2NicicsICdhcHBsaWNhdGlvbi94LWNiciddLFxuICAgIFsnY2J0JywgJ2FwcGxpY2F0aW9uL3gtY2JyJ10sXG4gICAgWydjYnonLCAnYXBwbGljYXRpb24veC1jYnInXSxcbiAgICBbJ2NjJywgJ3RleHQveC1jJ10sXG4gICAgWydjY28nLCAnYXBwbGljYXRpb24veC1jb2NvYSddLFxuICAgIFsnY2N0JywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2NjeG1sJywgJ2FwcGxpY2F0aW9uL2NjeG1sK3htbCddLFxuICAgIFsnY2RiY21zZycsICdhcHBsaWNhdGlvbi92bmQuY29udGFjdC5jbXNnJ10sXG4gICAgWydjZGEnLCAnYXBwbGljYXRpb24veC1jZGYnXSxcbiAgICBbJ2NkZicsICdhcHBsaWNhdGlvbi94LW5ldGNkZiddLFxuICAgIFsnY2RmeCcsICdhcHBsaWNhdGlvbi9jZGZ4K3htbCddLFxuICAgIFsnY2RrZXknLCAnYXBwbGljYXRpb24vdm5kLm1lZGlhc3RhdGlvbi5jZGtleSddLFxuICAgIFsnY2RtaWEnLCAnYXBwbGljYXRpb24vY2RtaS1jYXBhYmlsaXR5J10sXG4gICAgWydjZG1pYycsICdhcHBsaWNhdGlvbi9jZG1pLWNvbnRhaW5lciddLFxuICAgIFsnY2RtaWQnLCAnYXBwbGljYXRpb24vY2RtaS1kb21haW4nXSxcbiAgICBbJ2NkbWlvJywgJ2FwcGxpY2F0aW9uL2NkbWktb2JqZWN0J10sXG4gICAgWydjZG1pcScsICdhcHBsaWNhdGlvbi9jZG1pLXF1ZXVlJ10sXG4gICAgWydjZHInLCAnYXBwbGljYXRpb24vY2RyJ10sXG4gICAgWydjZHgnLCAnY2hlbWljYWwveC1jZHgnXSxcbiAgICBbJ2NkeG1sJywgJ2FwcGxpY2F0aW9uL3ZuZC5jaGVtZHJhdyt4bWwnXSxcbiAgICBbJ2NkeScsICdhcHBsaWNhdGlvbi92bmQuY2luZGVyZWxsYSddLFxuICAgIFsnY2VyJywgJ2FwcGxpY2F0aW9uL3BraXgtY2VydCddLFxuICAgIFsnY2ZzJywgJ2FwcGxpY2F0aW9uL3gtY2ZzLWNvbXByZXNzZWQnXSxcbiAgICBbJ2NnbScsICdpbWFnZS9jZ20nXSxcbiAgICBbJ2NoYXQnLCAnYXBwbGljYXRpb24veC1jaGF0J10sXG4gICAgWydjaG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLWh0bWxoZWxwJ10sXG4gICAgWydjaHJ0JywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua2NoYXJ0J10sXG4gICAgWydjaWYnLCAnY2hlbWljYWwveC1jaWYnXSxcbiAgICBbJ2NpaScsICdhcHBsaWNhdGlvbi92bmQuYW5zZXItd2ViLWNlcnRpZmljYXRlLWlzc3VlLWluaXRpYXRpb24nXSxcbiAgICBbJ2NpbCcsICdhcHBsaWNhdGlvbi92bmQubXMtYXJ0Z2FscnknXSxcbiAgICBbJ2NqcycsICdhcHBsaWNhdGlvbi9ub2RlJ10sXG4gICAgWydjbGEnLCAnYXBwbGljYXRpb24vdm5kLmNsYXltb3JlJ10sXG4gICAgWydjbGFzcycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2Nsa2snLCAnYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIua2V5Ym9hcmQnXSxcbiAgICBbJ2Nsa3AnLCAnYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIucGFsZXR0ZSddLFxuICAgIFsnY2xrdCcsICdhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci50ZW1wbGF0ZSddLFxuICAgIFsnY2xrdycsICdhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci53b3JkYmFuayddLFxuICAgIFsnY2xreCcsICdhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlciddLFxuICAgIFsnY2xwJywgJ2FwcGxpY2F0aW9uL3gtbXNjbGlwJ10sXG4gICAgWydjbWMnLCAnYXBwbGljYXRpb24vdm5kLmNvc21vY2FsbGVyJ10sXG4gICAgWydjbWRmJywgJ2NoZW1pY2FsL3gtY21kZiddLFxuICAgIFsnY21sJywgJ2NoZW1pY2FsL3gtY21sJ10sXG4gICAgWydjbXAnLCAnYXBwbGljYXRpb24vdm5kLnllbGxvd3JpdmVyLWN1c3RvbS1tZW51J10sXG4gICAgWydjbXgnLCAnaW1hZ2UveC1jbXgnXSxcbiAgICBbJ2NvZCcsICdhcHBsaWNhdGlvbi92bmQucmltLmNvZCddLFxuICAgIFsnY29mZmVlJywgJ3RleHQvY29mZmVlc2NyaXB0J10sXG4gICAgWydjb20nLCAnYXBwbGljYXRpb24veC1tc2Rvd25sb2FkJ10sXG4gICAgWydjb25mJywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ2NwaW8nLCAnYXBwbGljYXRpb24veC1jcGlvJ10sXG4gICAgWydjcHAnLCAndGV4dC94LWMnXSxcbiAgICBbJ2NwdCcsICdhcHBsaWNhdGlvbi9tYWMtY29tcGFjdHBybyddLFxuICAgIFsnY3JkJywgJ2FwcGxpY2F0aW9uL3gtbXNjYXJkZmlsZSddLFxuICAgIFsnY3JsJywgJ2FwcGxpY2F0aW9uL3BraXgtY3JsJ10sXG4gICAgWydjcnQnLCAnYXBwbGljYXRpb24veC14NTA5LWNhLWNlcnQnXSxcbiAgICBbJ2NyeCcsICdhcHBsaWNhdGlvbi94LWNocm9tZS1leHRlbnNpb24nXSxcbiAgICBbJ2NyeXB0b25vdGUnLCAnYXBwbGljYXRpb24vdm5kLnJpZy5jcnlwdG9ub3RlJ10sXG4gICAgWydjc2gnLCAnYXBwbGljYXRpb24veC1jc2gnXSxcbiAgICBbJ2NzbCcsICdhcHBsaWNhdGlvbi92bmQuY2l0YXRpb25zdHlsZXMuc3R5bGUreG1sJ10sXG4gICAgWydjc21sJywgJ2NoZW1pY2FsL3gtY3NtbCddLFxuICAgIFsnY3NwJywgJ2FwcGxpY2F0aW9uL3ZuZC5jb21tb25zcGFjZSddLFxuICAgIFsnY3NyJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnY3NzJywgJ3RleHQvY3NzJ10sXG4gICAgWydjc3QnLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnY3N2JywgJ3RleHQvY3N2J10sXG4gICAgWydjdScsICdhcHBsaWNhdGlvbi9jdS1zZWVtZSddLFxuICAgIFsnY3VybCcsICd0ZXh0L3ZuZC5jdXJsJ10sXG4gICAgWydjd3cnLCAnYXBwbGljYXRpb24vcHJzLmN3dyddLFxuICAgIFsnY3h0JywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2N4eCcsICd0ZXh0L3gtYyddLFxuICAgIFsnZGFlJywgJ21vZGVsL3ZuZC5jb2xsYWRhK3htbCddLFxuICAgIFsnZGFmJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMuZGFmJ10sXG4gICAgWydkYXJ0JywgJ2FwcGxpY2F0aW9uL3ZuZC5kYXJ0J10sXG4gICAgWydkYXRhbGVzcycsICdhcHBsaWNhdGlvbi92bmQuZmRzbi5zZWVkJ10sXG4gICAgWydkYXZtb3VudCcsICdhcHBsaWNhdGlvbi9kYXZtb3VudCt4bWwnXSxcbiAgICBbJ2RiZicsICdhcHBsaWNhdGlvbi92bmQuZGJmJ10sXG4gICAgWydkYmsnLCAnYXBwbGljYXRpb24vZG9jYm9vayt4bWwnXSxcbiAgICBbJ2RjcicsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydkY3VybCcsICd0ZXh0L3ZuZC5jdXJsLmRjdXJsJ10sXG4gICAgWydkZDInLCAnYXBwbGljYXRpb24vdm5kLm9tYS5kZDIreG1sJ10sXG4gICAgWydkZGQnLCAnYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kZGQnXSxcbiAgICBbJ2RkZicsICdhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtZGRmK3htbCddLFxuICAgIFsnZGRzJywgJ2ltYWdlL3ZuZC5tcy1kZHMnXSxcbiAgICBbJ2RlYicsICdhcHBsaWNhdGlvbi94LWRlYmlhbi1wYWNrYWdlJ10sXG4gICAgWydkZWYnLCAndGV4dC9wbGFpbiddLFxuICAgIFsnZGVwbG95JywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZGVyJywgJ2FwcGxpY2F0aW9uL3gteDUwOS1jYS1jZXJ0J10sXG4gICAgWydkZmFjJywgJ2FwcGxpY2F0aW9uL3ZuZC5kcmVhbWZhY3RvcnknXSxcbiAgICBbJ2RnYycsICdhcHBsaWNhdGlvbi94LWRnYy1jb21wcmVzc2VkJ10sXG4gICAgWydkaWMnLCAndGV4dC94LWMnXSxcbiAgICBbJ2RpcicsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydkaXMnLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy5kaXMnXSxcbiAgICBbJ2Rpc3Bvc2l0aW9uLW5vdGlmaWNhdGlvbicsICdtZXNzYWdlL2Rpc3Bvc2l0aW9uLW5vdGlmaWNhdGlvbiddLFxuICAgIFsnZGlzdCcsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2Rpc3R6JywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZGp2JywgJ2ltYWdlL3ZuZC5kanZ1J10sXG4gICAgWydkanZ1JywgJ2ltYWdlL3ZuZC5kanZ1J10sXG4gICAgWydkbGwnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkbWcnLCAnYXBwbGljYXRpb24veC1hcHBsZS1kaXNraW1hZ2UnXSxcbiAgICBbJ2RtbicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2RtcCcsICdhcHBsaWNhdGlvbi92bmQudGNwZHVtcC5wY2FwJ10sXG4gICAgWydkbXMnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkbmEnLCAnYXBwbGljYXRpb24vdm5kLmRuYSddLFxuICAgIFsnZG9jJywgJ2FwcGxpY2F0aW9uL21zd29yZCddLFxuICAgIFsnZG9jbScsICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ2RvY3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnXSxcbiAgICBbJ2RvdCcsICdhcHBsaWNhdGlvbi9tc3dvcmQnXSxcbiAgICBbJ2RvdG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmQudGVtcGxhdGUubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWydkb3R4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLnRlbXBsYXRlJ10sXG4gICAgWydkcCcsICdhcHBsaWNhdGlvbi92bmQub3NnaS5kcCddLFxuICAgIFsnZHBnJywgJ2FwcGxpY2F0aW9uL3ZuZC5kcGdyYXBoJ10sXG4gICAgWydkcmEnLCAnYXVkaW8vdm5kLmRyYSddLFxuICAgIFsnZHJsZScsICdpbWFnZS9kaWNvbS1ybGUnXSxcbiAgICBbJ2RzYycsICd0ZXh0L3Bycy5saW5lcy50YWcnXSxcbiAgICBbJ2Rzc2MnLCAnYXBwbGljYXRpb24vZHNzYytkZXInXSxcbiAgICBbJ2R0YicsICdhcHBsaWNhdGlvbi94LWR0Ym9vayt4bWwnXSxcbiAgICBbJ2R0ZCcsICdhcHBsaWNhdGlvbi94bWwtZHRkJ10sXG4gICAgWydkdHMnLCAnYXVkaW8vdm5kLmR0cyddLFxuICAgIFsnZHRzaGQnLCAnYXVkaW8vdm5kLmR0cy5oZCddLFxuICAgIFsnZHVtcCcsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2R2YicsICd2aWRlby92bmQuZHZiLmZpbGUnXSxcbiAgICBbJ2R2aScsICdhcHBsaWNhdGlvbi94LWR2aSddLFxuICAgIFsnZHdkJywgJ2FwcGxpY2F0aW9uL2F0c2MtZHdkK3htbCddLFxuICAgIFsnZHdmJywgJ21vZGVsL3ZuZC5kd2YnXSxcbiAgICBbJ2R3ZycsICdpbWFnZS92bmQuZHdnJ10sXG4gICAgWydkeGYnLCAnaW1hZ2Uvdm5kLmR4ZiddLFxuICAgIFsnZHhwJywgJ2FwcGxpY2F0aW9uL3ZuZC5zcG90ZmlyZS5keHAnXSxcbiAgICBbJ2R4cicsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydlYXInLCAnYXBwbGljYXRpb24vamF2YS1hcmNoaXZlJ10sXG4gICAgWydlY2VscDQ4MDAnLCAnYXVkaW8vdm5kLm51ZXJhLmVjZWxwNDgwMCddLFxuICAgIFsnZWNlbHA3NDcwJywgJ2F1ZGlvL3ZuZC5udWVyYS5lY2VscDc0NzAnXSxcbiAgICBbJ2VjZWxwOTYwMCcsICdhdWRpby92bmQubnVlcmEuZWNlbHA5NjAwJ10sXG4gICAgWydlY21hJywgJ2FwcGxpY2F0aW9uL2VjbWFzY3JpcHQnXSxcbiAgICBbJ2VkbScsICdhcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZWRtJ10sXG4gICAgWydlZHgnLCAnYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmVkeCddLFxuICAgIFsnZWZpZicsICdhcHBsaWNhdGlvbi92bmQucGljc2VsJ10sXG4gICAgWydlaTYnLCAnYXBwbGljYXRpb24vdm5kLnBnLm9zYXNsaSddLFxuICAgIFsnZWxjJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZW1mJywgJ2ltYWdlL2VtZiddLFxuICAgIFsnZW1sJywgJ21lc3NhZ2UvcmZjODIyJ10sXG4gICAgWydlbW1hJywgJ2FwcGxpY2F0aW9uL2VtbWEreG1sJ10sXG4gICAgWydlbW90aW9ubWwnLCAnYXBwbGljYXRpb24vZW1vdGlvbm1sK3htbCddLFxuICAgIFsnZW16JywgJ2FwcGxpY2F0aW9uL3gtbXNtZXRhZmlsZSddLFxuICAgIFsnZW9sJywgJ2F1ZGlvL3ZuZC5kaWdpdGFsLXdpbmRzJ10sXG4gICAgWydlb3QnLCAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnXSxcbiAgICBbJ2VwcycsICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J10sXG4gICAgWydlcHViJywgJ2FwcGxpY2F0aW9uL2VwdWIremlwJ10sXG4gICAgWydlcycsICdhcHBsaWNhdGlvbi9lY21hc2NyaXB0J10sXG4gICAgWydlczMnLCAnYXBwbGljYXRpb24vdm5kLmVzemlnbm8zK3htbCddLFxuICAgIFsnZXNhJywgJ2FwcGxpY2F0aW9uL3ZuZC5vc2dpLnN1YnN5c3RlbSddLFxuICAgIFsnZXNmJywgJ2FwcGxpY2F0aW9uL3ZuZC5lcHNvbi5lc2YnXSxcbiAgICBbJ2V0MycsICdhcHBsaWNhdGlvbi92bmQuZXN6aWdubzMreG1sJ10sXG4gICAgWydldHgnLCAndGV4dC94LXNldGV4dCddLFxuICAgIFsnZXZhJywgJ2FwcGxpY2F0aW9uL3gtZXZhJ10sXG4gICAgWydldnknLCAnYXBwbGljYXRpb24veC1lbnZveSddLFxuICAgIFsnZXhlJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZXhpJywgJ2FwcGxpY2F0aW9uL2V4aSddLFxuICAgIFsnZXhwJywgJ2FwcGxpY2F0aW9uL2V4cHJlc3MnXSxcbiAgICBbJ2V4cicsICdpbWFnZS9hY2VzJ10sXG4gICAgWydleHQnLCAnYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmV4dCddLFxuICAgIFsnZXonLCAnYXBwbGljYXRpb24vYW5kcmV3LWluc2V0J10sXG4gICAgWydlejInLCAnYXBwbGljYXRpb24vdm5kLmV6cGl4LWFsYnVtJ10sXG4gICAgWydlejMnLCAnYXBwbGljYXRpb24vdm5kLmV6cGl4LXBhY2thZ2UnXSxcbiAgICBbJ2YnLCAndGV4dC94LWZvcnRyYW4nXSxcbiAgICBbJ2Y0dicsICd2aWRlby9tcDQnXSxcbiAgICBbJ2Y3NycsICd0ZXh0L3gtZm9ydHJhbiddLFxuICAgIFsnZjkwJywgJ3RleHQveC1mb3J0cmFuJ10sXG4gICAgWydmYnMnLCAnaW1hZ2Uvdm5kLmZhc3RiaWRzaGVldCddLFxuICAgIFsnZmNkdCcsICdhcHBsaWNhdGlvbi92bmQuYWRvYmUuZm9ybXNjZW50cmFsLmZjZHQnXSxcbiAgICBbJ2ZjcycsICdhcHBsaWNhdGlvbi92bmQuaXNhYy5mY3MnXSxcbiAgICBbJ2ZkZicsICdhcHBsaWNhdGlvbi92bmQuZmRmJ10sXG4gICAgWydmZHQnLCAnYXBwbGljYXRpb24vZmR0K3htbCddLFxuICAgIFsnZmVfbGF1bmNoJywgJ2FwcGxpY2F0aW9uL3ZuZC5kZW5vdm8uZmNzZWxheW91dC1saW5rJ10sXG4gICAgWydmZzUnLCAnYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXNncCddLFxuICAgIFsnZmdkJywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2ZoJywgJ2ltYWdlL3gtZnJlZWhhbmQnXSxcbiAgICBbJ2ZoNCcsICdpbWFnZS94LWZyZWVoYW5kJ10sXG4gICAgWydmaDUnLCAnaW1hZ2UveC1mcmVlaGFuZCddLFxuICAgIFsnZmg3JywgJ2ltYWdlL3gtZnJlZWhhbmQnXSxcbiAgICBbJ2ZoYycsICdpbWFnZS94LWZyZWVoYW5kJ10sXG4gICAgWydmaWcnLCAnYXBwbGljYXRpb24veC14ZmlnJ10sXG4gICAgWydmaXRzJywgJ2ltYWdlL2ZpdHMnXSxcbiAgICBbJ2ZsYWMnLCAnYXVkaW8veC1mbGFjJ10sXG4gICAgWydmbGknLCAndmlkZW8veC1mbGknXSxcbiAgICBbJ2ZsbycsICdhcHBsaWNhdGlvbi92bmQubWljcm9ncmFmeC5mbG8nXSxcbiAgICBbJ2ZsdicsICd2aWRlby94LWZsdiddLFxuICAgIFsnZmx3JywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua2l2aW8nXSxcbiAgICBbJ2ZseCcsICd0ZXh0L3ZuZC5mbWkuZmxleHN0b3InXSxcbiAgICBbJ2ZseScsICd0ZXh0L3ZuZC5mbHknXSxcbiAgICBbJ2ZtJywgJ2FwcGxpY2F0aW9uL3ZuZC5mcmFtZW1ha2VyJ10sXG4gICAgWydmbmMnLCAnYXBwbGljYXRpb24vdm5kLmZyb2dhbnMuZm5jJ10sXG4gICAgWydmbycsICdhcHBsaWNhdGlvbi92bmQuc29mdHdhcmU2MDIuZmlsbGVyLmZvcm0reG1sJ10sXG4gICAgWydmb3InLCAndGV4dC94LWZvcnRyYW4nXSxcbiAgICBbJ2ZweCcsICdpbWFnZS92bmQuZnB4J10sXG4gICAgWydmcmFtZScsICdhcHBsaWNhdGlvbi92bmQuZnJhbWVtYWtlciddLFxuICAgIFsnZnNjJywgJ2FwcGxpY2F0aW9uL3ZuZC5mc2Mud2VibGF1bmNoJ10sXG4gICAgWydmc3QnLCAnaW1hZ2Uvdm5kLmZzdCddLFxuICAgIFsnZnRjJywgJ2FwcGxpY2F0aW9uL3ZuZC5mbHV4dGltZS5jbGlwJ10sXG4gICAgWydmdGknLCAnYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1mdW5kcy10cmFuc2Zlci1pbml0aWF0aW9uJ10sXG4gICAgWydmdnQnLCAndmlkZW8vdm5kLmZ2dCddLFxuICAgIFsnZnhwJywgJ2FwcGxpY2F0aW9uL3ZuZC5hZG9iZS5meHAnXSxcbiAgICBbJ2Z4cGwnLCAnYXBwbGljYXRpb24vdm5kLmFkb2JlLmZ4cCddLFxuICAgIFsnZnpzJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdXp6eXNoZWV0J10sXG4gICAgWydnMncnLCAnYXBwbGljYXRpb24vdm5kLmdlb3BsYW4nXSxcbiAgICBbJ2czJywgJ2ltYWdlL2czZmF4J10sXG4gICAgWydnM3cnLCAnYXBwbGljYXRpb24vdm5kLmdlb3NwYWNlJ10sXG4gICAgWydnYWMnLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS1hY2NvdW50J10sXG4gICAgWydnYW0nLCAnYXBwbGljYXRpb24veC10YWRzJ10sXG4gICAgWydnYnInLCAnYXBwbGljYXRpb24vcnBraS1naG9zdGJ1c3RlcnMnXSxcbiAgICBbJ2djYScsICdhcHBsaWNhdGlvbi94LWdjYS1jb21wcmVzc2VkJ10sXG4gICAgWydnZGwnLCAnbW9kZWwvdm5kLmdkbCddLFxuICAgIFsnZ2RvYycsICdhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMuZG9jdW1lbnQnXSxcbiAgICBbJ2dlbycsICdhcHBsaWNhdGlvbi92bmQuZHluYWdlbyddLFxuICAgIFsnZ2VvanNvbicsICdhcHBsaWNhdGlvbi9nZW8ranNvbiddLFxuICAgIFsnZ2V4JywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9tZXRyeS1leHBsb3JlciddLFxuICAgIFsnZ2diJywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9nZWJyYS5maWxlJ10sXG4gICAgWydnZ3QnLCAnYXBwbGljYXRpb24vdm5kLmdlb2dlYnJhLnRvb2wnXSxcbiAgICBbJ2doZicsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWhlbHAnXSxcbiAgICBbJ2dpZicsICdpbWFnZS9naWYnXSxcbiAgICBbJ2dpbScsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWlkZW50aXR5LW1lc3NhZ2UnXSxcbiAgICBbJ2dsYicsICdtb2RlbC9nbHRmLWJpbmFyeSddLFxuICAgIFsnZ2x0ZicsICdtb2RlbC9nbHRmK2pzb24nXSxcbiAgICBbJ2dtbCcsICdhcHBsaWNhdGlvbi9nbWwreG1sJ10sXG4gICAgWydnbXgnLCAnYXBwbGljYXRpb24vdm5kLmdteCddLFxuICAgIFsnZ251bWVyaWMnLCAnYXBwbGljYXRpb24veC1nbnVtZXJpYyddLFxuICAgIFsnZ3BnJywgJ2FwcGxpY2F0aW9uL2dwZy1rZXlzJ10sXG4gICAgWydncGgnLCAnYXBwbGljYXRpb24vdm5kLmZsb2dyYXBoaXQnXSxcbiAgICBbJ2dweCcsICdhcHBsaWNhdGlvbi9ncHgreG1sJ10sXG4gICAgWydncWYnLCAnYXBwbGljYXRpb24vdm5kLmdyYWZlcSddLFxuICAgIFsnZ3FzJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncmFmZXEnXSxcbiAgICBbJ2dyYW0nLCAnYXBwbGljYXRpb24vc3JncyddLFxuICAgIFsnZ3JhbXBzJywgJ2FwcGxpY2F0aW9uL3gtZ3JhbXBzLXhtbCddLFxuICAgIFsnZ3JlJywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9tZXRyeS1leHBsb3JlciddLFxuICAgIFsnZ3J2JywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaW5qZWN0b3InXSxcbiAgICBbJ2dyeG1sJywgJ2FwcGxpY2F0aW9uL3NyZ3MreG1sJ10sXG4gICAgWydnc2YnLCAnYXBwbGljYXRpb24veC1mb250LWdob3N0c2NyaXB0J10sXG4gICAgWydnc2hlZXQnLCAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLnNwcmVhZHNoZWV0J10sXG4gICAgWydnc2xpZGVzJywgJ2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtYXBwcy5wcmVzZW50YXRpb24nXSxcbiAgICBbJ2d0YXInLCAnYXBwbGljYXRpb24veC1ndGFyJ10sXG4gICAgWydndG0nLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS10b29sLW1lc3NhZ2UnXSxcbiAgICBbJ2d0dycsICdtb2RlbC92bmQuZ3R3J10sXG4gICAgWydndicsICd0ZXh0L3ZuZC5ncmFwaHZpeiddLFxuICAgIFsnZ3hmJywgJ2FwcGxpY2F0aW9uL2d4ZiddLFxuICAgIFsnZ3h0JywgJ2FwcGxpY2F0aW9uL3ZuZC5nZW9uZXh0J10sXG4gICAgWydneicsICdhcHBsaWNhdGlvbi9nemlwJ10sXG4gICAgWydnemlwJywgJ2FwcGxpY2F0aW9uL2d6aXAnXSxcbiAgICBbJ2gnLCAndGV4dC94LWMnXSxcbiAgICBbJ2gyNjEnLCAndmlkZW8vaDI2MSddLFxuICAgIFsnaDI2MycsICd2aWRlby9oMjYzJ10sXG4gICAgWydoMjY0JywgJ3ZpZGVvL2gyNjQnXSxcbiAgICBbJ2hhbCcsICdhcHBsaWNhdGlvbi92bmQuaGFsK3htbCddLFxuICAgIFsnaGJjaScsICdhcHBsaWNhdGlvbi92bmQuaGJjaSddLFxuICAgIFsnaGJzJywgJ3RleHQveC1oYW5kbGViYXJzLXRlbXBsYXRlJ10sXG4gICAgWydoZGQnLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LWhkZCddLFxuICAgIFsnaGRmJywgJ2FwcGxpY2F0aW9uL3gtaGRmJ10sXG4gICAgWydoZWljJywgJ2ltYWdlL2hlaWMnXSxcbiAgICBbJ2hlaWNzJywgJ2ltYWdlL2hlaWMtc2VxdWVuY2UnXSxcbiAgICBbJ2hlaWYnLCAnaW1hZ2UvaGVpZiddLFxuICAgIFsnaGVpZnMnLCAnaW1hZ2UvaGVpZi1zZXF1ZW5jZSddLFxuICAgIFsnaGVqMicsICdpbWFnZS9oZWoyayddLFxuICAgIFsnaGVsZCcsICdhcHBsaWNhdGlvbi9hdHNjLWhlbGQreG1sJ10sXG4gICAgWydoaCcsICd0ZXh0L3gtYyddLFxuICAgIFsnaGpzb24nLCAnYXBwbGljYXRpb24vaGpzb24nXSxcbiAgICBbJ2hscCcsICdhcHBsaWNhdGlvbi93aW5obHAnXSxcbiAgICBbJ2hwZ2wnLCAnYXBwbGljYXRpb24vdm5kLmhwLWhwZ2wnXSxcbiAgICBbJ2hwaWQnLCAnYXBwbGljYXRpb24vdm5kLmhwLWhwaWQnXSxcbiAgICBbJ2hwcycsICdhcHBsaWNhdGlvbi92bmQuaHAtaHBzJ10sXG4gICAgWydocXgnLCAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJ10sXG4gICAgWydoc2oyJywgJ2ltYWdlL2hzajInXSxcbiAgICBbJ2h0YycsICd0ZXh0L3gtY29tcG9uZW50J10sXG4gICAgWydodGtlJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZW5hbWVhYXBwJ10sXG4gICAgWydodG0nLCAndGV4dC9odG1sJ10sXG4gICAgWydodG1sJywgJ3RleHQvaHRtbCddLFxuICAgIFsnaHZkJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtZGljJ10sXG4gICAgWydodnAnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi12b2ljZSddLFxuICAgIFsnaHZzJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtc2NyaXB0J10sXG4gICAgWydpMmcnLCAnYXBwbGljYXRpb24vdm5kLmludGVyZ2VvJ10sXG4gICAgWydpY2MnLCAnYXBwbGljYXRpb24vdm5kLmljY3Byb2ZpbGUnXSxcbiAgICBbJ2ljZScsICd4LWNvbmZlcmVuY2UveC1jb29sdGFsayddLFxuICAgIFsnaWNtJywgJ2FwcGxpY2F0aW9uL3ZuZC5pY2Nwcm9maWxlJ10sXG4gICAgWydpY28nLCAnaW1hZ2UveC1pY29uJ10sXG4gICAgWydpY3MnLCAndGV4dC9jYWxlbmRhciddLFxuICAgIFsnaWVmJywgJ2ltYWdlL2llZiddLFxuICAgIFsnaWZiJywgJ3RleHQvY2FsZW5kYXInXSxcbiAgICBbJ2lmbScsICdhcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQuZm9ybWRhdGEnXSxcbiAgICBbJ2lnZXMnLCAnbW9kZWwvaWdlcyddLFxuICAgIFsnaWdsJywgJ2FwcGxpY2F0aW9uL3ZuZC5pZ2xvYWRlciddLFxuICAgIFsnaWdtJywgJ2FwcGxpY2F0aW9uL3ZuZC5pbnNvcnMuaWdtJ10sXG4gICAgWydpZ3MnLCAnbW9kZWwvaWdlcyddLFxuICAgIFsnaWd4JywgJ2FwcGxpY2F0aW9uL3ZuZC5taWNyb2dyYWZ4LmlneCddLFxuICAgIFsnaWlmJywgJ2FwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5pbnRlcmNoYW5nZSddLFxuICAgIFsnaW1nJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnaW1wJywgJ2FwcGxpY2F0aW9uL3ZuZC5hY2NwYWMuc2ltcGx5LmltcCddLFxuICAgIFsnaW1zJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1pbXMnXSxcbiAgICBbJ2luJywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ2luaScsICd0ZXh0L3BsYWluJ10sXG4gICAgWydpbmsnLCAnYXBwbGljYXRpb24vaW5rbWwreG1sJ10sXG4gICAgWydpbmttbCcsICdhcHBsaWNhdGlvbi9pbmttbCt4bWwnXSxcbiAgICBbJ2luc3RhbGwnLCAnYXBwbGljYXRpb24veC1pbnN0YWxsLWluc3RydWN0aW9ucyddLFxuICAgIFsnaW90YScsICdhcHBsaWNhdGlvbi92bmQuYXN0cmFlYS1zb2Z0d2FyZS5pb3RhJ10sXG4gICAgWydpcGZpeCcsICdhcHBsaWNhdGlvbi9pcGZpeCddLFxuICAgIFsnaXBrJywgJ2FwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5wYWNrYWdlJ10sXG4gICAgWydpcm0nLCAnYXBwbGljYXRpb24vdm5kLmlibS5yaWdodHMtbWFuYWdlbWVudCddLFxuICAgIFsnaXJwJywgJ2FwcGxpY2F0aW9uL3ZuZC5pcmVwb3NpdG9yeS5wYWNrYWdlK3htbCddLFxuICAgIFsnaXNvJywgJ2FwcGxpY2F0aW9uL3gtaXNvOTY2MC1pbWFnZSddLFxuICAgIFsnaXRwJywgJ2FwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5mb3JtdGVtcGxhdGUnXSxcbiAgICBbJ2l0cycsICdhcHBsaWNhdGlvbi9pdHMreG1sJ10sXG4gICAgWydpdnAnLCAnYXBwbGljYXRpb24vdm5kLmltbWVydmlzaW9uLWl2cCddLFxuICAgIFsnaXZ1JywgJ2FwcGxpY2F0aW9uL3ZuZC5pbW1lcnZpc2lvbi1pdnUnXSxcbiAgICBbJ2phZCcsICd0ZXh0L3ZuZC5zdW4uajJtZS5hcHAtZGVzY3JpcHRvciddLFxuICAgIFsnamFkZScsICd0ZXh0L2phZGUnXSxcbiAgICBbJ2phbScsICdhcHBsaWNhdGlvbi92bmQuamFtJ10sXG4gICAgWydqYXInLCAnYXBwbGljYXRpb24vamF2YS1hcmNoaXZlJ10sXG4gICAgWydqYXJkaWZmJywgJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlLWRpZmYnXSxcbiAgICBbJ2phdmEnLCAndGV4dC94LWphdmEtc291cmNlJ10sXG4gICAgWydqaGMnLCAnaW1hZ2UvanBoYyddLFxuICAgIFsnamlzcCcsICdhcHBsaWNhdGlvbi92bmQuamlzcCddLFxuICAgIFsnamxzJywgJ2ltYWdlL2pscyddLFxuICAgIFsnamx0JywgJ2FwcGxpY2F0aW9uL3ZuZC5ocC1qbHl0J10sXG4gICAgWydqbmcnLCAnaW1hZ2UveC1qbmcnXSxcbiAgICBbJ2pubHAnLCAnYXBwbGljYXRpb24veC1qYXZhLWpubHAtZmlsZSddLFxuICAgIFsnam9kYScsICdhcHBsaWNhdGlvbi92bmQuam9vc3Quam9kYS1hcmNoaXZlJ10sXG4gICAgWydqcDInLCAnaW1hZ2UvanAyJ10sXG4gICAgWydqcGUnLCAnaW1hZ2UvanBlZyddLFxuICAgIFsnanBlZycsICdpbWFnZS9qcGVnJ10sXG4gICAgWydqcGYnLCAnaW1hZ2UvanB4J10sXG4gICAgWydqcGcnLCAnaW1hZ2UvanBlZyddLFxuICAgIFsnanBnMicsICdpbWFnZS9qcDInXSxcbiAgICBbJ2pwZ20nLCAndmlkZW8vanBtJ10sXG4gICAgWydqcGd2JywgJ3ZpZGVvL2pwZWcnXSxcbiAgICBbJ2pwaCcsICdpbWFnZS9qcGgnXSxcbiAgICBbJ2pwbScsICd2aWRlby9qcG0nXSxcbiAgICBbJ2pweCcsICdpbWFnZS9qcHgnXSxcbiAgICBbJ2pzJywgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnXSxcbiAgICBbJ2pzb24nLCAnYXBwbGljYXRpb24vanNvbiddLFxuICAgIFsnanNvbjUnLCAnYXBwbGljYXRpb24vanNvbjUnXSxcbiAgICBbJ2pzb25sZCcsICdhcHBsaWNhdGlvbi9sZCtqc29uJ10sXG4gICAgLy8gaHR0cHM6Ly9qc29ubGluZXMub3JnL1xuICAgIFsnanNvbmwnLCAnYXBwbGljYXRpb24vanNvbmwnXSxcbiAgICBbJ2pzb25tbCcsICdhcHBsaWNhdGlvbi9qc29ubWwranNvbiddLFxuICAgIFsnanN4JywgJ3RleHQvanN4J10sXG4gICAgWydqeHInLCAnaW1hZ2UvanhyJ10sXG4gICAgWydqeHJhJywgJ2ltYWdlL2p4cmEnXSxcbiAgICBbJ2p4cnMnLCAnaW1hZ2UvanhycyddLFxuICAgIFsnanhzJywgJ2ltYWdlL2p4cyddLFxuICAgIFsnanhzYycsICdpbWFnZS9qeHNjJ10sXG4gICAgWydqeHNpJywgJ2ltYWdlL2p4c2knXSxcbiAgICBbJ2p4c3MnLCAnaW1hZ2UvanhzcyddLFxuICAgIFsna2FyJywgJ2F1ZGlvL21pZGknXSxcbiAgICBbJ2thcmJvbicsICdhcHBsaWNhdGlvbi92bmQua2RlLmthcmJvbiddLFxuICAgIFsna2RiJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsna2RieCcsICdhcHBsaWNhdGlvbi94LWtlZXBhc3MyJ10sXG4gICAgWydrZXknLCAnYXBwbGljYXRpb24veC1pd29yay1rZXlub3RlLXNmZmtleSddLFxuICAgIFsna2ZvJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua2Zvcm11bGEnXSxcbiAgICBbJ2tpYScsICdhcHBsaWNhdGlvbi92bmQua2lkc3BpcmF0aW9uJ10sXG4gICAgWydrbWwnLCAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1lYXJ0aC5rbWwreG1sJ10sXG4gICAgWydrbXonLCAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1lYXJ0aC5rbXonXSxcbiAgICBbJ2tuZScsICdhcHBsaWNhdGlvbi92bmQua2luYXInXSxcbiAgICBbJ2tucCcsICdhcHBsaWNhdGlvbi92bmQua2luYXInXSxcbiAgICBbJ2tvbicsICdhcHBsaWNhdGlvbi92bmQua2RlLmtvbnRvdXInXSxcbiAgICBbJ2twcicsICdhcHBsaWNhdGlvbi92bmQua2RlLmtwcmVzZW50ZXInXSxcbiAgICBbJ2twdCcsICdhcHBsaWNhdGlvbi92bmQua2RlLmtwcmVzZW50ZXInXSxcbiAgICBbJ2tweHgnLCAnYXBwbGljYXRpb24vdm5kLmRzLWtleXBvaW50J10sXG4gICAgWydrc3AnLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rc3ByZWFkJ10sXG4gICAgWydrdHInLCAnYXBwbGljYXRpb24vdm5kLmthaG9vdHonXSxcbiAgICBbJ2t0eCcsICdpbWFnZS9rdHgnXSxcbiAgICBbJ2t0eDInLCAnaW1hZ2Uva3R4MiddLFxuICAgIFsna3R6JywgJ2FwcGxpY2F0aW9uL3ZuZC5rYWhvb3R6J10sXG4gICAgWydrd2QnLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rd29yZCddLFxuICAgIFsna3d0JywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua3dvcmQnXSxcbiAgICBbJ2xhc3htbCcsICdhcHBsaWNhdGlvbi92bmQubGFzLmxhcyt4bWwnXSxcbiAgICBbJ2xhdGV4JywgJ2FwcGxpY2F0aW9uL3gtbGF0ZXgnXSxcbiAgICBbJ2xiZCcsICdhcHBsaWNhdGlvbi92bmQubGxhbWFncmFwaGljcy5saWZlLWJhbGFuY2UuZGVza3RvcCddLFxuICAgIFsnbGJlJywgJ2FwcGxpY2F0aW9uL3ZuZC5sbGFtYWdyYXBoaWNzLmxpZmUtYmFsYW5jZS5leGNoYW5nZSt4bWwnXSxcbiAgICBbJ2xlcycsICdhcHBsaWNhdGlvbi92bmQuaGhlLmxlc3Nvbi1wbGF5ZXInXSxcbiAgICBbJ2xlc3MnLCAndGV4dC9sZXNzJ10sXG4gICAgWydsZ3InLCAnYXBwbGljYXRpb24vbGdyK3htbCddLFxuICAgIFsnbGhhJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnbGluazY2JywgJ2FwcGxpY2F0aW9uL3ZuZC5yb3V0ZTY2Lmxpbms2Nit4bWwnXSxcbiAgICBbJ2xpc3QnLCAndGV4dC9wbGFpbiddLFxuICAgIFsnbGlzdDM4MjAnLCAnYXBwbGljYXRpb24vdm5kLmlibS5tb2RjYXAnXSxcbiAgICBbJ2xpc3RhZnAnLCAnYXBwbGljYXRpb24vdm5kLmlibS5tb2RjYXAnXSxcbiAgICBbJ2xpdGNvZmZlZScsICd0ZXh0L2NvZmZlZXNjcmlwdCddLFxuICAgIFsnbG5rJywgJ2FwcGxpY2F0aW9uL3gtbXMtc2hvcnRjdXQnXSxcbiAgICBbJ2xvZycsICd0ZXh0L3BsYWluJ10sXG4gICAgWydsb3N0eG1sJywgJ2FwcGxpY2F0aW9uL2xvc3QreG1sJ10sXG4gICAgWydscmYnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydscm0nLCAnYXBwbGljYXRpb24vdm5kLm1zLWxybSddLFxuICAgIFsnbHRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5mcm9nYW5zLmx0ZiddLFxuICAgIFsnbHVhJywgJ3RleHQveC1sdWEnXSxcbiAgICBbJ2x1YWMnLCAnYXBwbGljYXRpb24veC1sdWEtYnl0ZWNvZGUnXSxcbiAgICBbJ2x2cCcsICdhdWRpby92bmQubHVjZW50LnZvaWNlJ10sXG4gICAgWydsd3AnLCAnYXBwbGljYXRpb24vdm5kLmxvdHVzLXdvcmRwcm8nXSxcbiAgICBbJ2x6aCcsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ20xdicsICd2aWRlby9tcGVnJ10sXG4gICAgWydtMmEnLCAnYXVkaW8vbXBlZyddLFxuICAgIFsnbTJ2JywgJ3ZpZGVvL21wZWcnXSxcbiAgICBbJ20zYScsICdhdWRpby9tcGVnJ10sXG4gICAgWydtM3UnLCAndGV4dC9wbGFpbiddLFxuICAgIFsnbTN1OCcsICdhcHBsaWNhdGlvbi92bmQuYXBwbGUubXBlZ3VybCddLFxuICAgIFsnbTRhJywgJ2F1ZGlvL3gtbTRhJ10sXG4gICAgWydtNHAnLCAnYXBwbGljYXRpb24vbXA0J10sXG4gICAgWydtNHMnLCAndmlkZW8vaXNvLnNlZ21lbnQnXSxcbiAgICBbJ200dScsICdhcHBsaWNhdGlvbi92bmQubXBlZ3VybCddLFxuICAgIFsnbTR2JywgJ3ZpZGVvL3gtbTR2J10sXG4gICAgWydtMTMnLCAnYXBwbGljYXRpb24veC1tc21lZGlhdmlldyddLFxuICAgIFsnbTE0JywgJ2FwcGxpY2F0aW9uL3gtbXNtZWRpYXZpZXcnXSxcbiAgICBbJ20yMScsICdhcHBsaWNhdGlvbi9tcDIxJ10sXG4gICAgWydtYScsICdhcHBsaWNhdGlvbi9tYXRoZW1hdGljYSddLFxuICAgIFsnbWFkcycsICdhcHBsaWNhdGlvbi9tYWRzK3htbCddLFxuICAgIFsnbWFlaScsICdhcHBsaWNhdGlvbi9tbXQtYWVpK3htbCddLFxuICAgIFsnbWFnJywgJ2FwcGxpY2F0aW9uL3ZuZC5lY293aW4uY2hhcnQnXSxcbiAgICBbJ21ha2VyJywgJ2FwcGxpY2F0aW9uL3ZuZC5mcmFtZW1ha2VyJ10sXG4gICAgWydtYW4nLCAndGV4dC90cm9mZiddLFxuICAgIFsnbWFuaWZlc3QnLCAndGV4dC9jYWNoZS1tYW5pZmVzdCddLFxuICAgIFsnbWFwJywgJ2FwcGxpY2F0aW9uL2pzb24nXSxcbiAgICBbJ21hcicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ21hcmtkb3duJywgJ3RleHQvbWFya2Rvd24nXSxcbiAgICBbJ21hdGhtbCcsICdhcHBsaWNhdGlvbi9tYXRobWwreG1sJ10sXG4gICAgWydtYicsICdhcHBsaWNhdGlvbi9tYXRoZW1hdGljYSddLFxuICAgIFsnbWJrJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubWJrJ10sXG4gICAgWydtYm94JywgJ2FwcGxpY2F0aW9uL21ib3gnXSxcbiAgICBbJ21jMScsICdhcHBsaWNhdGlvbi92bmQubWVkY2FsY2RhdGEnXSxcbiAgICBbJ21jZCcsICdhcHBsaWNhdGlvbi92bmQubWNkJ10sXG4gICAgWydtY3VybCcsICd0ZXh0L3ZuZC5jdXJsLm1jdXJsJ10sXG4gICAgWydtZCcsICd0ZXh0L21hcmtkb3duJ10sXG4gICAgWydtZGInLCAnYXBwbGljYXRpb24veC1tc2FjY2VzcyddLFxuICAgIFsnbWRpJywgJ2ltYWdlL3ZuZC5tcy1tb2RpJ10sXG4gICAgWydtZHgnLCAndGV4dC9tZHgnXSxcbiAgICBbJ21lJywgJ3RleHQvdHJvZmYnXSxcbiAgICBbJ21lc2gnLCAnbW9kZWwvbWVzaCddLFxuICAgIFsnbWV0YTQnLCAnYXBwbGljYXRpb24vbWV0YWxpbms0K3htbCddLFxuICAgIFsnbWV0YWxpbmsnLCAnYXBwbGljYXRpb24vbWV0YWxpbmsreG1sJ10sXG4gICAgWydtZXRzJywgJ2FwcGxpY2F0aW9uL21ldHMreG1sJ10sXG4gICAgWydtZm0nLCAnYXBwbGljYXRpb24vdm5kLm1mbXAnXSxcbiAgICBbJ21mdCcsICdhcHBsaWNhdGlvbi9ycGtpLW1hbmlmZXN0J10sXG4gICAgWydtZ3AnLCAnYXBwbGljYXRpb24vdm5kLm9zZ2VvLm1hcGd1aWRlLnBhY2thZ2UnXSxcbiAgICBbJ21neicsICdhcHBsaWNhdGlvbi92bmQucHJvdGV1cy5tYWdhemluZSddLFxuICAgIFsnbWlkJywgJ2F1ZGlvL21pZGknXSxcbiAgICBbJ21pZGknLCAnYXVkaW8vbWlkaSddLFxuICAgIFsnbWllJywgJ2FwcGxpY2F0aW9uL3gtbWllJ10sXG4gICAgWydtaWYnLCAnYXBwbGljYXRpb24vdm5kLm1pZiddLFxuICAgIFsnbWltZScsICdtZXNzYWdlL3JmYzgyMiddLFxuICAgIFsnbWoyJywgJ3ZpZGVvL21qMiddLFxuICAgIFsnbWpwMicsICd2aWRlby9tajInXSxcbiAgICBbJ21qcycsICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0J10sXG4gICAgWydtazNkJywgJ3ZpZGVvL3gtbWF0cm9za2EnXSxcbiAgICBbJ21rYScsICdhdWRpby94LW1hdHJvc2thJ10sXG4gICAgWydta2QnLCAndGV4dC94LW1hcmtkb3duJ10sXG4gICAgWydta3MnLCAndmlkZW8veC1tYXRyb3NrYSddLFxuICAgIFsnbWt2JywgJ3ZpZGVvL3gtbWF0cm9za2EnXSxcbiAgICBbJ21scCcsICdhcHBsaWNhdGlvbi92bmQuZG9sYnkubWxwJ10sXG4gICAgWydtbWQnLCAnYXBwbGljYXRpb24vdm5kLmNoaXBudXRzLmthcmFva2UtbW1kJ10sXG4gICAgWydtbWYnLCAnYXBwbGljYXRpb24vdm5kLnNtYWYnXSxcbiAgICBbJ21tbCcsICd0ZXh0L21hdGhtbCddLFxuICAgIFsnbW1yJywgJ2ltYWdlL3ZuZC5mdWppeGVyb3guZWRtaWNzLW1tciddLFxuICAgIFsnbW5nJywgJ3ZpZGVvL3gtbW5nJ10sXG4gICAgWydtbnknLCAnYXBwbGljYXRpb24veC1tc21vbmV5J10sXG4gICAgWydtb2JpJywgJ2FwcGxpY2F0aW9uL3gtbW9iaXBvY2tldC1lYm9vayddLFxuICAgIFsnbW9kcycsICdhcHBsaWNhdGlvbi9tb2RzK3htbCddLFxuICAgIFsnbW92JywgJ3ZpZGVvL3F1aWNrdGltZSddLFxuICAgIFsnbW92aWUnLCAndmlkZW8veC1zZ2ktbW92aWUnXSxcbiAgICBbJ21wMicsICdhdWRpby9tcGVnJ10sXG4gICAgWydtcDJhJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ21wMycsICdhdWRpby9tcGVnJ10sXG4gICAgWydtcDQnLCAndmlkZW8vbXA0J10sXG4gICAgWydtcDRhJywgJ2F1ZGlvL21wNCddLFxuICAgIFsnbXA0cycsICdhcHBsaWNhdGlvbi9tcDQnXSxcbiAgICBbJ21wNHYnLCAndmlkZW8vbXA0J10sXG4gICAgWydtcDIxJywgJ2FwcGxpY2F0aW9uL21wMjEnXSxcbiAgICBbJ21wYycsICdhcHBsaWNhdGlvbi92bmQubW9waHVuLmNlcnRpZmljYXRlJ10sXG4gICAgWydtcGQnLCAnYXBwbGljYXRpb24vZGFzaCt4bWwnXSxcbiAgICBbJ21wZScsICd2aWRlby9tcGVnJ10sXG4gICAgWydtcGVnJywgJ3ZpZGVvL21wZWcnXSxcbiAgICBbJ21wZycsICd2aWRlby9tcGVnJ10sXG4gICAgWydtcGc0JywgJ3ZpZGVvL21wNCddLFxuICAgIFsnbXBnYScsICdhdWRpby9tcGVnJ10sXG4gICAgWydtcGtnJywgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5pbnN0YWxsZXIreG1sJ10sXG4gICAgWydtcG0nLCAnYXBwbGljYXRpb24vdm5kLmJsdWVpY2UubXVsdGlwYXNzJ10sXG4gICAgWydtcG4nLCAnYXBwbGljYXRpb24vdm5kLm1vcGh1bi5hcHBsaWNhdGlvbiddLFxuICAgIFsnbXBwJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wcm9qZWN0J10sXG4gICAgWydtcHQnLCAnYXBwbGljYXRpb24vdm5kLm1zLXByb2plY3QnXSxcbiAgICBbJ21weScsICdhcHBsaWNhdGlvbi92bmQuaWJtLm1pbmlwYXknXSxcbiAgICBbJ21xeScsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLm1xeSddLFxuICAgIFsnbXJjJywgJ2FwcGxpY2F0aW9uL21hcmMnXSxcbiAgICBbJ21yY3gnLCAnYXBwbGljYXRpb24vbWFyY3htbCt4bWwnXSxcbiAgICBbJ21zJywgJ3RleHQvdHJvZmYnXSxcbiAgICBbJ21zY21sJywgJ2FwcGxpY2F0aW9uL21lZGlhc2VydmVyY29udHJvbCt4bWwnXSxcbiAgICBbJ21zZWVkJywgJ2FwcGxpY2F0aW9uL3ZuZC5mZHNuLm1zZWVkJ10sXG4gICAgWydtc2VxJywgJ2FwcGxpY2F0aW9uL3ZuZC5tc2VxJ10sXG4gICAgWydtc2YnLCAnYXBwbGljYXRpb24vdm5kLmVwc29uLm1zZiddLFxuICAgIFsnbXNnJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1vdXRsb29rJ10sXG4gICAgWydtc2gnLCAnbW9kZWwvbWVzaCddLFxuICAgIFsnbXNpJywgJ2FwcGxpY2F0aW9uL3gtbXNkb3dubG9hZCddLFxuICAgIFsnbXNsJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubXNsJ10sXG4gICAgWydtc20nLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydtc3AnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydtc3R5JywgJ2FwcGxpY2F0aW9uL3ZuZC5tdXZlZS5zdHlsZSddLFxuICAgIFsnbXRsJywgJ21vZGVsL210bCddLFxuICAgIFsnbXRzJywgJ21vZGVsL3ZuZC5tdHMnXSxcbiAgICBbJ211cycsICdhcHBsaWNhdGlvbi92bmQubXVzaWNpYW4nXSxcbiAgICBbJ211c2QnLCAnYXBwbGljYXRpb24vbW10LXVzZCt4bWwnXSxcbiAgICBbJ211c2ljeG1sJywgJ2FwcGxpY2F0aW9uL3ZuZC5yZWNvcmRhcmUubXVzaWN4bWwreG1sJ10sXG4gICAgWydtdmInLCAnYXBwbGljYXRpb24veC1tc21lZGlhdmlldyddLFxuICAgIFsnbXZ0JywgJ2FwcGxpY2F0aW9uL3ZuZC5tYXBib3gtdmVjdG9yLXRpbGUnXSxcbiAgICBbJ213ZicsICdhcHBsaWNhdGlvbi92bmQubWZlciddLFxuICAgIFsnbXhmJywgJ2FwcGxpY2F0aW9uL214ZiddLFxuICAgIFsnbXhsJywgJ2FwcGxpY2F0aW9uL3ZuZC5yZWNvcmRhcmUubXVzaWN4bWwnXSxcbiAgICBbJ214bWYnLCAnYXVkaW8vbW9iaWxlLXhtZiddLFxuICAgIFsnbXhtbCcsICdhcHBsaWNhdGlvbi94dit4bWwnXSxcbiAgICBbJ214cycsICdhcHBsaWNhdGlvbi92bmQudHJpc2NhcGUubXhzJ10sXG4gICAgWydteHUnLCAndmlkZW8vdm5kLm1wZWd1cmwnXSxcbiAgICBbJ24tZ2FnZScsICdhcHBsaWNhdGlvbi92bmQubm9raWEubi1nYWdlLnN5bWJpYW4uaW5zdGFsbCddLFxuICAgIFsnbjMnLCAndGV4dC9uMyddLFxuICAgIFsnbmInLCAnYXBwbGljYXRpb24vbWF0aGVtYXRpY2EnXSxcbiAgICBbJ25icCcsICdhcHBsaWNhdGlvbi92bmQud29sZnJhbS5wbGF5ZXInXSxcbiAgICBbJ25jJywgJ2FwcGxpY2F0aW9uL3gtbmV0Y2RmJ10sXG4gICAgWyduY3gnLCAnYXBwbGljYXRpb24veC1kdGJuY3greG1sJ10sXG4gICAgWyduZm8nLCAndGV4dC94LW5mbyddLFxuICAgIFsnbmdkYXQnLCAnYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5kYXRhJ10sXG4gICAgWyduaXRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5uaXRmJ10sXG4gICAgWydubHUnLCAnYXBwbGljYXRpb24vdm5kLm5ldXJvbGFuZ3VhZ2Uubmx1J10sXG4gICAgWydubWwnLCAnYXBwbGljYXRpb24vdm5kLmVubGl2ZW4nXSxcbiAgICBbJ25uZCcsICdhcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtZGlyZWN0b3J5J10sXG4gICAgWydubnMnLCAnYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LXNlYWxlciddLFxuICAgIFsnbm53JywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC13ZWInXSxcbiAgICBbJ25weCcsICdpbWFnZS92bmQubmV0LWZweCddLFxuICAgIFsnbnEnLCAnYXBwbGljYXRpb24vbi1xdWFkcyddLFxuICAgIFsnbnNjJywgJ2FwcGxpY2F0aW9uL3gtY29uZmVyZW5jZSddLFxuICAgIFsnbnNmJywgJ2FwcGxpY2F0aW9uL3ZuZC5sb3R1cy1ub3RlcyddLFxuICAgIFsnbnQnLCAnYXBwbGljYXRpb24vbi10cmlwbGVzJ10sXG4gICAgWydudGYnLCAnYXBwbGljYXRpb24vdm5kLm5pdGYnXSxcbiAgICBbJ251bWJlcnMnLCAnYXBwbGljYXRpb24veC1pd29yay1udW1iZXJzLXNmZm51bWJlcnMnXSxcbiAgICBbJ256YicsICdhcHBsaWNhdGlvbi94LW56YiddLFxuICAgIFsnb2EyJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzMiddLFxuICAgIFsnb2EzJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzMyddLFxuICAgIFsnb2FzJywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzJ10sXG4gICAgWydvYmQnLCAnYXBwbGljYXRpb24veC1tc2JpbmRlciddLFxuICAgIFsnb2JneCcsICdhcHBsaWNhdGlvbi92bmQub3BlbmJsb3guZ2FtZSt4bWwnXSxcbiAgICBbJ29iaicsICdtb2RlbC9vYmonXSxcbiAgICBbJ29kYScsICdhcHBsaWNhdGlvbi9vZGEnXSxcbiAgICBbJ29kYicsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmRhdGFiYXNlJ10sXG4gICAgWydvZGMnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5jaGFydCddLFxuICAgIFsnb2RmJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZm9ybXVsYSddLFxuICAgIFsnb2RmdCcsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmZvcm11bGEtdGVtcGxhdGUnXSxcbiAgICBbJ29kZycsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmdyYXBoaWNzJ10sXG4gICAgWydvZGknLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5pbWFnZSddLFxuICAgIFsnb2RtJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC1tYXN0ZXInXSxcbiAgICBbJ29kcCcsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbiddLFxuICAgIFsnb2RzJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQnXSxcbiAgICBbJ29kdCcsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnXSxcbiAgICBbJ29nYScsICdhdWRpby9vZ2cnXSxcbiAgICBbJ29nZXgnLCAnbW9kZWwvdm5kLm9wZW5nZXgnXSxcbiAgICBbJ29nZycsICdhdWRpby9vZ2cnXSxcbiAgICBbJ29ndicsICd2aWRlby9vZ2cnXSxcbiAgICBbJ29neCcsICdhcHBsaWNhdGlvbi9vZ2cnXSxcbiAgICBbJ29tZG9jJywgJ2FwcGxpY2F0aW9uL29tZG9jK3htbCddLFxuICAgIFsnb25lcGtnJywgJ2FwcGxpY2F0aW9uL29uZW5vdGUnXSxcbiAgICBbJ29uZXRtcCcsICdhcHBsaWNhdGlvbi9vbmVub3RlJ10sXG4gICAgWydvbmV0b2MnLCAnYXBwbGljYXRpb24vb25lbm90ZSddLFxuICAgIFsnb25ldG9jMicsICdhcHBsaWNhdGlvbi9vbmVub3RlJ10sXG4gICAgWydvcGYnLCAnYXBwbGljYXRpb24vb2VicHMtcGFja2FnZSt4bWwnXSxcbiAgICBbJ29wbWwnLCAndGV4dC94LW9wbWwnXSxcbiAgICBbJ29wcmMnLCAnYXBwbGljYXRpb24vdm5kLnBhbG0nXSxcbiAgICBbJ29wdXMnLCAnYXVkaW8vb2dnJ10sXG4gICAgWydvcmcnLCAndGV4dC94LW9yZyddLFxuICAgIFsnb3NmJywgJ2FwcGxpY2F0aW9uL3ZuZC55YW1haGEub3BlbnNjb3JlZm9ybWF0J10sXG4gICAgWydvc2ZwdmcnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5vcGVuc2NvcmVmb3JtYXQub3NmcHZnK3htbCddLFxuICAgIFsnb3NtJywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVuc3RyZWV0bWFwLmRhdGEreG1sJ10sXG4gICAgWydvdGMnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5jaGFydC10ZW1wbGF0ZSddLFxuICAgIFsnb3RmJywgJ2ZvbnQvb3RmJ10sXG4gICAgWydvdGcnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5ncmFwaGljcy10ZW1wbGF0ZSddLFxuICAgIFsnb3RoJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC13ZWInXSxcbiAgICBbJ290aScsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmltYWdlLXRlbXBsYXRlJ10sXG4gICAgWydvdHAnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24tdGVtcGxhdGUnXSxcbiAgICBbJ290cycsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0LXRlbXBsYXRlJ10sXG4gICAgWydvdHQnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LXRlbXBsYXRlJ10sXG4gICAgWydvdmEnLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LW92YSddLFxuICAgIFsnb3ZmJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1vdmYnXSxcbiAgICBbJ293bCcsICdhcHBsaWNhdGlvbi9yZGYreG1sJ10sXG4gICAgWydveHBzJywgJ2FwcGxpY2F0aW9uL294cHMnXSxcbiAgICBbJ294dCcsICdhcHBsaWNhdGlvbi92bmQub3Blbm9mZmljZW9yZy5leHRlbnNpb24nXSxcbiAgICBbJ3AnLCAndGV4dC94LXBhc2NhbCddLFxuICAgIFsncDdhJywgJ2FwcGxpY2F0aW9uL3gtcGtjczctc2lnbmF0dXJlJ10sXG4gICAgWydwN2InLCAnYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0aWZpY2F0ZXMnXSxcbiAgICBbJ3A3YycsICdhcHBsaWNhdGlvbi9wa2NzNy1taW1lJ10sXG4gICAgWydwN20nLCAnYXBwbGljYXRpb24vcGtjczctbWltZSddLFxuICAgIFsncDdyJywgJ2FwcGxpY2F0aW9uL3gtcGtjczctY2VydHJlcXJlc3AnXSxcbiAgICBbJ3A3cycsICdhcHBsaWNhdGlvbi9wa2NzNy1zaWduYXR1cmUnXSxcbiAgICBbJ3A4JywgJ2FwcGxpY2F0aW9uL3BrY3M4J10sXG4gICAgWydwMTAnLCAnYXBwbGljYXRpb24veC1wa2NzMTAnXSxcbiAgICBbJ3AxMicsICdhcHBsaWNhdGlvbi94LXBrY3MxMiddLFxuICAgIFsncGFjJywgJ2FwcGxpY2F0aW9uL3gtbnMtcHJveHktYXV0b2NvbmZpZyddLFxuICAgIFsncGFnZXMnLCAnYXBwbGljYXRpb24veC1pd29yay1wYWdlcy1zZmZwYWdlcyddLFxuICAgIFsncGFzJywgJ3RleHQveC1wYXNjYWwnXSxcbiAgICBbJ3BhdycsICdhcHBsaWNhdGlvbi92bmQucGF3YWFmaWxlJ10sXG4gICAgWydwYmQnLCAnYXBwbGljYXRpb24vdm5kLnBvd2VyYnVpbGRlcjYnXSxcbiAgICBbJ3BibScsICdpbWFnZS94LXBvcnRhYmxlLWJpdG1hcCddLFxuICAgIFsncGNhcCcsICdhcHBsaWNhdGlvbi92bmQudGNwZHVtcC5wY2FwJ10sXG4gICAgWydwY2YnLCAnYXBwbGljYXRpb24veC1mb250LXBjZiddLFxuICAgIFsncGNsJywgJ2FwcGxpY2F0aW9uL3ZuZC5ocC1wY2wnXSxcbiAgICBbJ3BjbHhsJywgJ2FwcGxpY2F0aW9uL3ZuZC5ocC1wY2x4bCddLFxuICAgIFsncGN0JywgJ2ltYWdlL3gtcGljdCddLFxuICAgIFsncGN1cmwnLCAnYXBwbGljYXRpb24vdm5kLmN1cmwucGN1cmwnXSxcbiAgICBbJ3BjeCcsICdpbWFnZS94LXBjeCddLFxuICAgIFsncGRiJywgJ2FwcGxpY2F0aW9uL3gtcGlsb3QnXSxcbiAgICBbJ3BkZScsICd0ZXh0L3gtcHJvY2Vzc2luZyddLFxuICAgIFsncGRmJywgJ2FwcGxpY2F0aW9uL3BkZiddLFxuICAgIFsncGVtJywgJ2FwcGxpY2F0aW9uL3gteDUwOS11c2VyLWNlcnQnXSxcbiAgICBbJ3BmYScsICdhcHBsaWNhdGlvbi94LWZvbnQtdHlwZTEnXSxcbiAgICBbJ3BmYicsICdhcHBsaWNhdGlvbi94LWZvbnQtdHlwZTEnXSxcbiAgICBbJ3BmbScsICdhcHBsaWNhdGlvbi94LWZvbnQtdHlwZTEnXSxcbiAgICBbJ3BmcicsICdhcHBsaWNhdGlvbi9mb250LXRkcGZyJ10sXG4gICAgWydwZngnLCAnYXBwbGljYXRpb24veC1wa2NzMTInXSxcbiAgICBbJ3BnbScsICdpbWFnZS94LXBvcnRhYmxlLWdyYXltYXAnXSxcbiAgICBbJ3BnbicsICdhcHBsaWNhdGlvbi94LWNoZXNzLXBnbiddLFxuICAgIFsncGdwJywgJ2FwcGxpY2F0aW9uL3BncCddLFxuICAgIFsncGhwJywgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJ10sXG4gICAgWydwaHAzJywgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJ10sXG4gICAgWydwaHA0JywgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJ10sXG4gICAgWydwaHBzJywgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwLXNvdXJjZSddLFxuICAgIFsncGh0bWwnLCAnYXBwbGljYXRpb24veC1odHRwZC1waHAnXSxcbiAgICBbJ3BpYycsICdpbWFnZS94LXBpY3QnXSxcbiAgICBbJ3BrZycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ3BraScsICdhcHBsaWNhdGlvbi9wa2l4Y21wJ10sXG4gICAgWydwa2lwYXRoJywgJ2FwcGxpY2F0aW9uL3BraXgtcGtpcGF0aCddLFxuICAgIFsncGtwYXNzJywgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5wa3Bhc3MnXSxcbiAgICBbJ3BsJywgJ2FwcGxpY2F0aW9uL3gtcGVybCddLFxuICAgIFsncGxiJywgJ2FwcGxpY2F0aW9uL3ZuZC4zZ3BwLnBpYy1idy1sYXJnZSddLFxuICAgIFsncGxjJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMucGxjJ10sXG4gICAgWydwbGYnLCAnYXBwbGljYXRpb24vdm5kLnBvY2tldGxlYXJuJ10sXG4gICAgWydwbHMnLCAnYXBwbGljYXRpb24vcGxzK3htbCddLFxuICAgIFsncG0nLCAnYXBwbGljYXRpb24veC1wZXJsJ10sXG4gICAgWydwbWwnLCAnYXBwbGljYXRpb24vdm5kLmN0Yy1wb3NtbCddLFxuICAgIFsncG5nJywgJ2ltYWdlL3BuZyddLFxuICAgIFsncG5tJywgJ2ltYWdlL3gtcG9ydGFibGUtYW55bWFwJ10sXG4gICAgWydwb3J0cGtnJywgJ2FwcGxpY2F0aW9uL3ZuZC5tYWNwb3J0cy5wb3J0cGtnJ10sXG4gICAgWydwb3QnLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXSxcbiAgICBbJ3BvdG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQucHJlc2VudGF0aW9uLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsncG90eCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwudGVtcGxhdGUnXSxcbiAgICBbJ3BwYScsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCddLFxuICAgIFsncHBhbScsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5hZGRpbi5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3BwZCcsICdhcHBsaWNhdGlvbi92bmQuY3Vwcy1wcGQnXSxcbiAgICBbJ3BwbScsICdpbWFnZS94LXBvcnRhYmxlLXBpeG1hcCddLFxuICAgIFsncHBzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J10sXG4gICAgWydwcHNtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnNsaWRlc2hvdy5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3Bwc3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnNsaWRlc2hvdyddLFxuICAgIFsncHB0JywgJ2FwcGxpY2F0aW9uL3Bvd2VycG9pbnQnXSxcbiAgICBbJ3BwdG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQucHJlc2VudGF0aW9uLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsncHB0eCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uJ10sXG4gICAgWydwcWEnLCAnYXBwbGljYXRpb24vdm5kLnBhbG0nXSxcbiAgICBbJ3ByYycsICdhcHBsaWNhdGlvbi94LXBpbG90J10sXG4gICAgWydwcmUnLCAnYXBwbGljYXRpb24vdm5kLmxvdHVzLWZyZWVsYW5jZSddLFxuICAgIFsncHJmJywgJ2FwcGxpY2F0aW9uL3BpY3MtcnVsZXMnXSxcbiAgICBbJ3Byb3Z4JywgJ2FwcGxpY2F0aW9uL3Byb3ZlbmFuY2UreG1sJ10sXG4gICAgWydwcycsICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J10sXG4gICAgWydwc2InLCAnYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LXNtYWxsJ10sXG4gICAgWydwc2QnLCAnYXBwbGljYXRpb24veC1waG90b3Nob3AnXSxcbiAgICBbJ3BzZicsICdhcHBsaWNhdGlvbi94LWZvbnQtbGludXgtcHNmJ10sXG4gICAgWydwc2tjeG1sJywgJ2FwcGxpY2F0aW9uL3Bza2MreG1sJ10sXG4gICAgWydwdGknLCAnaW1hZ2UvcHJzLnB0aSddLFxuICAgIFsncHRpZCcsICdhcHBsaWNhdGlvbi92bmQucHZpLnB0aWQxJ10sXG4gICAgWydwdWInLCAnYXBwbGljYXRpb24veC1tc3B1Ymxpc2hlciddLFxuICAgIFsncHZiJywgJ2FwcGxpY2F0aW9uL3ZuZC4zZ3BwLnBpYy1idy12YXInXSxcbiAgICBbJ3B3bicsICdhcHBsaWNhdGlvbi92bmQuM20ucG9zdC1pdC1ub3RlcyddLFxuICAgIFsncHlhJywgJ2F1ZGlvL3ZuZC5tcy1wbGF5cmVhZHkubWVkaWEucHlhJ10sXG4gICAgWydweXYnLCAndmlkZW8vdm5kLm1zLXBsYXlyZWFkeS5tZWRpYS5weXYnXSxcbiAgICBbJ3FhbScsICdhcHBsaWNhdGlvbi92bmQuZXBzb24ucXVpY2thbmltZSddLFxuICAgIFsncWJvJywgJ2FwcGxpY2F0aW9uL3ZuZC5pbnR1LnFibyddLFxuICAgIFsncWZ4JywgJ2FwcGxpY2F0aW9uL3ZuZC5pbnR1LnFmeCddLFxuICAgIFsncXBzJywgJ2FwcGxpY2F0aW9uL3ZuZC5wdWJsaXNoYXJlLWRlbHRhLXRyZWUnXSxcbiAgICBbJ3F0JywgJ3ZpZGVvL3F1aWNrdGltZSddLFxuICAgIFsncXdkJywgJ2FwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzcyddLFxuICAgIFsncXd0JywgJ2FwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzcyddLFxuICAgIFsncXhiJywgJ2FwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzcyddLFxuICAgIFsncXhkJywgJ2FwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzcyddLFxuICAgIFsncXhsJywgJ2FwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzcyddLFxuICAgIFsncXh0JywgJ2FwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzcyddLFxuICAgIFsncmEnLCAnYXVkaW8veC1yZWFsYXVkaW8nXSxcbiAgICBbJ3JhbScsICdhdWRpby94LXBuLXJlYWxhdWRpbyddLFxuICAgIFsncmFtbCcsICdhcHBsaWNhdGlvbi9yYW1sK3lhbWwnXSxcbiAgICBbJ3JhcGQnLCAnYXBwbGljYXRpb24vcm91dGUtYXBkK3htbCddLFxuICAgIFsncmFyJywgJ2FwcGxpY2F0aW9uL3gtcmFyJ10sXG4gICAgWydyYXMnLCAnaW1hZ2UveC1jbXUtcmFzdGVyJ10sXG4gICAgWydyY3Byb2ZpbGUnLCAnYXBwbGljYXRpb24vdm5kLmlwdW5wbHVnZ2VkLnJjcHJvZmlsZSddLFxuICAgIFsncmRmJywgJ2FwcGxpY2F0aW9uL3JkZit4bWwnXSxcbiAgICBbJ3JkeicsICdhcHBsaWNhdGlvbi92bmQuZGF0YS12aXNpb24ucmR6J10sXG4gICAgWydyZWxvJywgJ2FwcGxpY2F0aW9uL3AycC1vdmVybGF5K3htbCddLFxuICAgIFsncmVwJywgJ2FwcGxpY2F0aW9uL3ZuZC5idXNpbmVzc29iamVjdHMnXSxcbiAgICBbJ3JlcycsICdhcHBsaWNhdGlvbi94LWR0YnJlc291cmNlK3htbCddLFxuICAgIFsncmdiJywgJ2ltYWdlL3gtcmdiJ10sXG4gICAgWydyaWYnLCAnYXBwbGljYXRpb24vcmVnaW5mbyt4bWwnXSxcbiAgICBbJ3JpcCcsICdhdWRpby92bmQucmlwJ10sXG4gICAgWydyaXMnLCAnYXBwbGljYXRpb24veC1yZXNlYXJjaC1pbmZvLXN5c3RlbXMnXSxcbiAgICBbJ3JsJywgJ2FwcGxpY2F0aW9uL3Jlc291cmNlLWxpc3RzK3htbCddLFxuICAgIFsncmxjJywgJ2ltYWdlL3ZuZC5mdWppeGVyb3guZWRtaWNzLXJsYyddLFxuICAgIFsncmxkJywgJ2FwcGxpY2F0aW9uL3Jlc291cmNlLWxpc3RzLWRpZmYreG1sJ10sXG4gICAgWydybScsICdhdWRpby94LXBuLXJlYWxhdWRpbyddLFxuICAgIFsncm1pJywgJ2F1ZGlvL21pZGknXSxcbiAgICBbJ3JtcCcsICdhdWRpby94LXBuLXJlYWxhdWRpby1wbHVnaW4nXSxcbiAgICBbJ3JtcycsICdhcHBsaWNhdGlvbi92bmQuamNwLmphdmFtZS5taWRsZXQtcm1zJ10sXG4gICAgWydybXZiJywgJ2FwcGxpY2F0aW9uL3ZuZC5ybi1yZWFsbWVkaWEtdmJyJ10sXG4gICAgWydybmMnLCAnYXBwbGljYXRpb24vcmVsYXgtbmctY29tcGFjdC1zeW50YXgnXSxcbiAgICBbJ3JuZycsICdhcHBsaWNhdGlvbi94bWwnXSxcbiAgICBbJ3JvYScsICdhcHBsaWNhdGlvbi9ycGtpLXJvYSddLFxuICAgIFsncm9mZicsICd0ZXh0L3Ryb2ZmJ10sXG4gICAgWydycDknLCAnYXBwbGljYXRpb24vdm5kLmNsb2FudG8ucnA5J10sXG4gICAgWydycG0nLCAnYXVkaW8veC1wbi1yZWFsYXVkaW8tcGx1Z2luJ10sXG4gICAgWydycHNzJywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2tpYS5yYWRpby1wcmVzZXRzJ10sXG4gICAgWydycHN0JywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2tpYS5yYWRpby1wcmVzZXQnXSxcbiAgICBbJ3JxJywgJ2FwcGxpY2F0aW9uL3NwYXJxbC1xdWVyeSddLFxuICAgIFsncnMnLCAnYXBwbGljYXRpb24vcmxzLXNlcnZpY2VzK3htbCddLFxuICAgIFsncnNhJywgJ2FwcGxpY2F0aW9uL3gtcGtjczcnXSxcbiAgICBbJ3JzYXQnLCAnYXBwbGljYXRpb24vYXRzYy1yc2F0K3htbCddLFxuICAgIFsncnNkJywgJ2FwcGxpY2F0aW9uL3JzZCt4bWwnXSxcbiAgICBbJ3JzaGVldCcsICdhcHBsaWNhdGlvbi91cmMtcmVzc2hlZXQreG1sJ10sXG4gICAgWydyc3MnLCAnYXBwbGljYXRpb24vcnNzK3htbCddLFxuICAgIFsncnRmJywgJ3RleHQvcnRmJ10sXG4gICAgWydydHgnLCAndGV4dC9yaWNodGV4dCddLFxuICAgIFsncnVuJywgJ2FwcGxpY2F0aW9uL3gtbWFrZXNlbGYnXSxcbiAgICBbJ3J1c2QnLCAnYXBwbGljYXRpb24vcm91dGUtdXNkK3htbCddLFxuICAgIFsncnYnLCAndmlkZW8vdm5kLnJuLXJlYWx2aWRlbyddLFxuICAgIFsncycsICd0ZXh0L3gtYXNtJ10sXG4gICAgWydzM20nLCAnYXVkaW8vczNtJ10sXG4gICAgWydzYWYnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5zbWFmLWF1ZGlvJ10sXG4gICAgWydzYXNzJywgJ3RleHQveC1zYXNzJ10sXG4gICAgWydzYm1sJywgJ2FwcGxpY2F0aW9uL3NibWwreG1sJ10sXG4gICAgWydzYycsICdhcHBsaWNhdGlvbi92bmQuaWJtLnNlY3VyZS1jb250YWluZXInXSxcbiAgICBbJ3NjZCcsICdhcHBsaWNhdGlvbi94LW1zc2NoZWR1bGUnXSxcbiAgICBbJ3NjbScsICdhcHBsaWNhdGlvbi92bmQubG90dXMtc2NyZWVuY2FtJ10sXG4gICAgWydzY3EnLCAnYXBwbGljYXRpb24vc2N2cC1jdi1yZXF1ZXN0J10sXG4gICAgWydzY3MnLCAnYXBwbGljYXRpb24vc2N2cC1jdi1yZXNwb25zZSddLFxuICAgIFsnc2NzcycsICd0ZXh0L3gtc2NzcyddLFxuICAgIFsnc2N1cmwnLCAndGV4dC92bmQuY3VybC5zY3VybCddLFxuICAgIFsnc2RhJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24uZHJhdyddLFxuICAgIFsnc2RjJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24uY2FsYyddLFxuICAgIFsnc2RkJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24uaW1wcmVzcyddLFxuICAgIFsnc2RrZCcsICdhcHBsaWNhdGlvbi92bmQuc29sZW50LnNka20reG1sJ10sXG4gICAgWydzZGttJywgJ2FwcGxpY2F0aW9uL3ZuZC5zb2xlbnQuc2RrbSt4bWwnXSxcbiAgICBbJ3NkcCcsICdhcHBsaWNhdGlvbi9zZHAnXSxcbiAgICBbJ3NkdycsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlciddLFxuICAgIFsnc2VhJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnc2VlJywgJ2FwcGxpY2F0aW9uL3ZuZC5zZWVtYWlsJ10sXG4gICAgWydzZWVkJywgJ2FwcGxpY2F0aW9uL3ZuZC5mZHNuLnNlZWQnXSxcbiAgICBbJ3NlbWEnLCAnYXBwbGljYXRpb24vdm5kLnNlbWEnXSxcbiAgICBbJ3NlbWQnLCAnYXBwbGljYXRpb24vdm5kLnNlbWQnXSxcbiAgICBbJ3NlbWYnLCAnYXBwbGljYXRpb24vdm5kLnNlbWYnXSxcbiAgICBbJ3Nlbm1seCcsICdhcHBsaWNhdGlvbi9zZW5tbCt4bWwnXSxcbiAgICBbJ3NlbnNtbHgnLCAnYXBwbGljYXRpb24vc2Vuc21sK3htbCddLFxuICAgIFsnc2VyJywgJ2FwcGxpY2F0aW9uL2phdmEtc2VyaWFsaXplZC1vYmplY3QnXSxcbiAgICBbJ3NldHBheScsICdhcHBsaWNhdGlvbi9zZXQtcGF5bWVudC1pbml0aWF0aW9uJ10sXG4gICAgWydzZXRyZWcnLCAnYXBwbGljYXRpb24vc2V0LXJlZ2lzdHJhdGlvbi1pbml0aWF0aW9uJ10sXG4gICAgWydzZmQtaGRzdHgnLCAnYXBwbGljYXRpb24vdm5kLmh5ZHJvc3RhdGl4LnNvZi1kYXRhJ10sXG4gICAgWydzZnMnLCAnYXBwbGljYXRpb24vdm5kLnNwb3RmaXJlLnNmcyddLFxuICAgIFsnc2Z2JywgJ3RleHQveC1zZnYnXSxcbiAgICBbJ3NnaScsICdpbWFnZS9zZ2knXSxcbiAgICBbJ3NnbCcsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlci1nbG9iYWwnXSxcbiAgICBbJ3NnbScsICd0ZXh0L3NnbWwnXSxcbiAgICBbJ3NnbWwnLCAndGV4dC9zZ21sJ10sXG4gICAgWydzaCcsICdhcHBsaWNhdGlvbi94LXNoJ10sXG4gICAgWydzaGFyJywgJ2FwcGxpY2F0aW9uL3gtc2hhciddLFxuICAgIFsnc2hleCcsICd0ZXh0L3NoZXgnXSxcbiAgICBbJ3NoZicsICdhcHBsaWNhdGlvbi9zaGYreG1sJ10sXG4gICAgWydzaHRtbCcsICd0ZXh0L2h0bWwnXSxcbiAgICBbJ3NpZCcsICdpbWFnZS94LW1yc2lkLWltYWdlJ10sXG4gICAgWydzaWV2ZScsICdhcHBsaWNhdGlvbi9zaWV2ZSddLFxuICAgIFsnc2lnJywgJ2FwcGxpY2F0aW9uL3BncC1zaWduYXR1cmUnXSxcbiAgICBbJ3NpbCcsICdhdWRpby9zaWxrJ10sXG4gICAgWydzaWxvJywgJ21vZGVsL21lc2gnXSxcbiAgICBbJ3NpcycsICdhcHBsaWNhdGlvbi92bmQuc3ltYmlhbi5pbnN0YWxsJ10sXG4gICAgWydzaXN4JywgJ2FwcGxpY2F0aW9uL3ZuZC5zeW1iaWFuLmluc3RhbGwnXSxcbiAgICBbJ3NpdCcsICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnXSxcbiAgICBbJ3NpdHgnLCAnYXBwbGljYXRpb24veC1zdHVmZml0eCddLFxuICAgIFsnc2l2JywgJ2FwcGxpY2F0aW9uL3NpZXZlJ10sXG4gICAgWydza2QnLCAnYXBwbGljYXRpb24vdm5kLmtvYW4nXSxcbiAgICBbJ3NrbScsICdhcHBsaWNhdGlvbi92bmQua29hbiddLFxuICAgIFsnc2twJywgJ2FwcGxpY2F0aW9uL3ZuZC5rb2FuJ10sXG4gICAgWydza3QnLCAnYXBwbGljYXRpb24vdm5kLmtvYW4nXSxcbiAgICBbJ3NsZG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuc2xpZGUubWFjcm9lbmFibGVkLjEyJ10sXG4gICAgWydzbGR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZSddLFxuICAgIFsnc2xpbScsICd0ZXh0L3NsaW0nXSxcbiAgICBbJ3NsbScsICd0ZXh0L3NsaW0nXSxcbiAgICBbJ3NscycsICdhcHBsaWNhdGlvbi9yb3V0ZS1zLXRzaWQreG1sJ10sXG4gICAgWydzbHQnLCAnYXBwbGljYXRpb24vdm5kLmVwc29uLnNhbHQnXSxcbiAgICBbJ3NtJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGVwbWFuaWEuc3RlcGNoYXJ0J10sXG4gICAgWydzbWYnLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5tYXRoJ10sXG4gICAgWydzbWknLCAnYXBwbGljYXRpb24vc21pbCddLFxuICAgIFsnc21pbCcsICdhcHBsaWNhdGlvbi9zbWlsJ10sXG4gICAgWydzbXYnLCAndmlkZW8veC1zbXYnXSxcbiAgICBbJ3NtemlwJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGVwbWFuaWEucGFja2FnZSddLFxuICAgIFsnc25kJywgJ2F1ZGlvL2Jhc2ljJ10sXG4gICAgWydzbmYnLCAnYXBwbGljYXRpb24veC1mb250LXNuZiddLFxuICAgIFsnc28nLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydzcGMnLCAnYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0aWZpY2F0ZXMnXSxcbiAgICBbJ3NwZHgnLCAndGV4dC9zcGR4J10sXG4gICAgWydzcGYnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5zbWFmLXBocmFzZSddLFxuICAgIFsnc3BsJywgJ2FwcGxpY2F0aW9uL3gtZnV0dXJlc3BsYXNoJ10sXG4gICAgWydzcG90JywgJ3RleHQvdm5kLmluM2Quc3BvdCddLFxuICAgIFsnc3BwJywgJ2FwcGxpY2F0aW9uL3NjdnAtdnAtcmVzcG9uc2UnXSxcbiAgICBbJ3NwcScsICdhcHBsaWNhdGlvbi9zY3ZwLXZwLXJlcXVlc3QnXSxcbiAgICBbJ3NweCcsICdhdWRpby9vZ2cnXSxcbiAgICBbJ3NxbCcsICdhcHBsaWNhdGlvbi94LXNxbCddLFxuICAgIFsnc3JjJywgJ2FwcGxpY2F0aW9uL3gtd2Fpcy1zb3VyY2UnXSxcbiAgICBbJ3NydCcsICdhcHBsaWNhdGlvbi94LXN1YnJpcCddLFxuICAgIFsnc3J1JywgJ2FwcGxpY2F0aW9uL3NydSt4bWwnXSxcbiAgICBbJ3NyeCcsICdhcHBsaWNhdGlvbi9zcGFycWwtcmVzdWx0cyt4bWwnXSxcbiAgICBbJ3NzZGwnLCAnYXBwbGljYXRpb24vc3NkbCt4bWwnXSxcbiAgICBbJ3NzZScsICdhcHBsaWNhdGlvbi92bmQua29kYWstZGVzY3JpcHRvciddLFxuICAgIFsnc3NmJywgJ2FwcGxpY2F0aW9uL3ZuZC5lcHNvbi5zc2YnXSxcbiAgICBbJ3NzbWwnLCAnYXBwbGljYXRpb24vc3NtbCt4bWwnXSxcbiAgICBbJ3NzdCcsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ3N0JywgJ2FwcGxpY2F0aW9uL3ZuZC5zYWlsaW5ndHJhY2tlci50cmFjayddLFxuICAgIFsnc3RjJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmNhbGMudGVtcGxhdGUnXSxcbiAgICBbJ3N0ZCcsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3LnRlbXBsYXRlJ10sXG4gICAgWydzdGYnLCAnYXBwbGljYXRpb24vdm5kLnd0LnN0ZiddLFxuICAgIFsnc3RpJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmltcHJlc3MudGVtcGxhdGUnXSxcbiAgICBbJ3N0aycsICdhcHBsaWNhdGlvbi9oeXBlcnN0dWRpbyddLFxuICAgIFsnc3RsJywgJ21vZGVsL3N0bCddLFxuICAgIFsnc3RweCcsICdtb2RlbC9zdGVwK3htbCddLFxuICAgIFsnc3RweHonLCAnbW9kZWwvc3RlcC14bWwremlwJ10sXG4gICAgWydzdHB6JywgJ21vZGVsL3N0ZXAremlwJ10sXG4gICAgWydzdHInLCAnYXBwbGljYXRpb24vdm5kLnBnLmZvcm1hdCddLFxuICAgIFsnc3R3JywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci50ZW1wbGF0ZSddLFxuICAgIFsnc3R5bCcsICd0ZXh0L3N0eWx1cyddLFxuICAgIFsnc3R5bHVzJywgJ3RleHQvc3R5bHVzJ10sXG4gICAgWydzdWInLCAndGV4dC92bmQuZHZiLnN1YnRpdGxlJ10sXG4gICAgWydzdXMnLCAnYXBwbGljYXRpb24vdm5kLnN1cy1jYWxlbmRhciddLFxuICAgIFsnc3VzcCcsICdhcHBsaWNhdGlvbi92bmQuc3VzLWNhbGVuZGFyJ10sXG4gICAgWydzdjRjcGlvJywgJ2FwcGxpY2F0aW9uL3gtc3Y0Y3BpbyddLFxuICAgIFsnc3Y0Y3JjJywgJ2FwcGxpY2F0aW9uL3gtc3Y0Y3JjJ10sXG4gICAgWydzdmMnLCAnYXBwbGljYXRpb24vdm5kLmR2Yi5zZXJ2aWNlJ10sXG4gICAgWydzdmQnLCAnYXBwbGljYXRpb24vdm5kLnN2ZCddLFxuICAgIFsnc3ZnJywgJ2ltYWdlL3N2Zyt4bWwnXSxcbiAgICBbJ3N2Z3onLCAnaW1hZ2Uvc3ZnK3htbCddLFxuICAgIFsnc3dhJywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ3N3ZicsICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCddLFxuICAgIFsnc3dpJywgJ2FwcGxpY2F0aW9uL3ZuZC5hcmlzdGFuZXR3b3Jrcy5zd2knXSxcbiAgICBbJ3N3aWR0YWcnLCAnYXBwbGljYXRpb24vc3dpZCt4bWwnXSxcbiAgICBbJ3N4YycsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5jYWxjJ10sXG4gICAgWydzeGQnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuZHJhdyddLFxuICAgIFsnc3hnJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci5nbG9iYWwnXSxcbiAgICBbJ3N4aScsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzJ10sXG4gICAgWydzeG0nLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwubWF0aCddLFxuICAgIFsnc3h3JywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlciddLFxuICAgIFsndCcsICd0ZXh0L3Ryb2ZmJ10sXG4gICAgWyd0MycsICdhcHBsaWNhdGlvbi94LXQzdm0taW1hZ2UnXSxcbiAgICBbJ3QzOCcsICdpbWFnZS90MzgnXSxcbiAgICBbJ3RhZ2xldCcsICdhcHBsaWNhdGlvbi92bmQubXluZmMnXSxcbiAgICBbJ3RhbycsICdhcHBsaWNhdGlvbi92bmQudGFvLmludGVudC1tb2R1bGUtYXJjaGl2ZSddLFxuICAgIFsndGFwJywgJ2ltYWdlL3ZuZC50ZW5jZW50LnRhcCddLFxuICAgIFsndGFyJywgJ2FwcGxpY2F0aW9uL3gtdGFyJ10sXG4gICAgWyd0Y2FwJywgJ2FwcGxpY2F0aW9uL3ZuZC4zZ3BwMi50Y2FwJ10sXG4gICAgWyd0Y2wnLCAnYXBwbGljYXRpb24veC10Y2wnXSxcbiAgICBbJ3RkJywgJ2FwcGxpY2F0aW9uL3VyYy10YXJnZXRkZXNjK3htbCddLFxuICAgIFsndGVhY2hlcicsICdhcHBsaWNhdGlvbi92bmQuc21hcnQudGVhY2hlciddLFxuICAgIFsndGVpJywgJ2FwcGxpY2F0aW9uL3RlaSt4bWwnXSxcbiAgICBbJ3RlaWNvcnB1cycsICdhcHBsaWNhdGlvbi90ZWkreG1sJ10sXG4gICAgWyd0ZXgnLCAnYXBwbGljYXRpb24veC10ZXgnXSxcbiAgICBbJ3RleGknLCAnYXBwbGljYXRpb24veC10ZXhpbmZvJ10sXG4gICAgWyd0ZXhpbmZvJywgJ2FwcGxpY2F0aW9uL3gtdGV4aW5mbyddLFxuICAgIFsndGV4dCcsICd0ZXh0L3BsYWluJ10sXG4gICAgWyd0ZmknLCAnYXBwbGljYXRpb24vdGhyYXVkK3htbCddLFxuICAgIFsndGZtJywgJ2FwcGxpY2F0aW9uL3gtdGV4LXRmbSddLFxuICAgIFsndGZ4JywgJ2ltYWdlL3RpZmYtZngnXSxcbiAgICBbJ3RnYScsICdpbWFnZS94LXRnYSddLFxuICAgIFsndGd6JywgJ2FwcGxpY2F0aW9uL3gtdGFyJ10sXG4gICAgWyd0aG14JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1vZmZpY2V0aGVtZSddLFxuICAgIFsndGlmJywgJ2ltYWdlL3RpZmYnXSxcbiAgICBbJ3RpZmYnLCAnaW1hZ2UvdGlmZiddLFxuICAgIFsndGsnLCAnYXBwbGljYXRpb24veC10Y2wnXSxcbiAgICBbJ3RtbycsICdhcHBsaWNhdGlvbi92bmQudG1vYmlsZS1saXZldHYnXSxcbiAgICBbJ3RvbWwnLCAnYXBwbGljYXRpb24vdG9tbCddLFxuICAgIFsndG9ycmVudCcsICdhcHBsaWNhdGlvbi94LWJpdHRvcnJlbnQnXSxcbiAgICBbJ3RwbCcsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXRvb2wtdGVtcGxhdGUnXSxcbiAgICBbJ3RwdCcsICdhcHBsaWNhdGlvbi92bmQudHJpZC50cHQnXSxcbiAgICBbJ3RyJywgJ3RleHQvdHJvZmYnXSxcbiAgICBbJ3RyYScsICdhcHBsaWNhdGlvbi92bmQudHJ1ZWFwcCddLFxuICAgIFsndHJpZycsICdhcHBsaWNhdGlvbi90cmlnJ10sXG4gICAgWyd0cm0nLCAnYXBwbGljYXRpb24veC1tc3Rlcm1pbmFsJ10sXG4gICAgWyd0cycsICd2aWRlby9tcDJ0J10sXG4gICAgWyd0c2QnLCAnYXBwbGljYXRpb24vdGltZXN0YW1wZWQtZGF0YSddLFxuICAgIFsndHN2JywgJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnXSxcbiAgICBbJ3R0YycsICdmb250L2NvbGxlY3Rpb24nXSxcbiAgICBbJ3R0ZicsICdmb250L3R0ZiddLFxuICAgIFsndHRsJywgJ3RleHQvdHVydGxlJ10sXG4gICAgWyd0dG1sJywgJ2FwcGxpY2F0aW9uL3R0bWwreG1sJ10sXG4gICAgWyd0d2QnLCAnYXBwbGljYXRpb24vdm5kLnNpbXRlY2gtbWluZG1hcHBlciddLFxuICAgIFsndHdkcycsICdhcHBsaWNhdGlvbi92bmQuc2ltdGVjaC1taW5kbWFwcGVyJ10sXG4gICAgWyd0eGQnLCAnYXBwbGljYXRpb24vdm5kLmdlbm9tYXRpeC50dXhlZG8nXSxcbiAgICBbJ3R4ZicsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLnR4ZiddLFxuICAgIFsndHh0JywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ3U4ZHNuJywgJ21lc3NhZ2UvZ2xvYmFsLWRlbGl2ZXJ5LXN0YXR1cyddLFxuICAgIFsndThoZHInLCAnbWVzc2FnZS9nbG9iYWwtaGVhZGVycyddLFxuICAgIFsndThtZG4nLCAnbWVzc2FnZS9nbG9iYWwtZGlzcG9zaXRpb24tbm90aWZpY2F0aW9uJ10sXG4gICAgWyd1OG1zZycsICdtZXNzYWdlL2dsb2JhbCddLFxuICAgIFsndTMyJywgJ2FwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1iaW4nXSxcbiAgICBbJ3ViaicsICdhcHBsaWNhdGlvbi91Ympzb24nXSxcbiAgICBbJ3VkZWInLCAnYXBwbGljYXRpb24veC1kZWJpYW4tcGFja2FnZSddLFxuICAgIFsndWZkJywgJ2FwcGxpY2F0aW9uL3ZuZC51ZmRsJ10sXG4gICAgWyd1ZmRsJywgJ2FwcGxpY2F0aW9uL3ZuZC51ZmRsJ10sXG4gICAgWyd1bHgnLCAnYXBwbGljYXRpb24veC1nbHVseCddLFxuICAgIFsndW1qJywgJ2FwcGxpY2F0aW9uL3ZuZC51bWFqaW4nXSxcbiAgICBbJ3VuaXR5d2ViJywgJ2FwcGxpY2F0aW9uL3ZuZC51bml0eSddLFxuICAgIFsndW9tbCcsICdhcHBsaWNhdGlvbi92bmQudW9tbCt4bWwnXSxcbiAgICBbJ3VyaScsICd0ZXh0L3VyaS1saXN0J10sXG4gICAgWyd1cmlzJywgJ3RleHQvdXJpLWxpc3QnXSxcbiAgICBbJ3VybHMnLCAndGV4dC91cmktbGlzdCddLFxuICAgIFsndXNkeicsICdtb2RlbC92bmQudXNkeit6aXAnXSxcbiAgICBbJ3VzdGFyJywgJ2FwcGxpY2F0aW9uL3gtdXN0YXInXSxcbiAgICBbJ3V0eicsICdhcHBsaWNhdGlvbi92bmQudWlxLnRoZW1lJ10sXG4gICAgWyd1dScsICd0ZXh0L3gtdXVlbmNvZGUnXSxcbiAgICBbJ3V2YScsICdhdWRpby92bmQuZGVjZS5hdWRpbyddLFxuICAgIFsndXZkJywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLmRhdGEnXSxcbiAgICBbJ3V2ZicsICdhcHBsaWNhdGlvbi92bmQuZGVjZS5kYXRhJ10sXG4gICAgWyd1dmcnLCAnaW1hZ2Uvdm5kLmRlY2UuZ3JhcGhpYyddLFxuICAgIFsndXZoJywgJ3ZpZGVvL3ZuZC5kZWNlLmhkJ10sXG4gICAgWyd1dmknLCAnaW1hZ2Uvdm5kLmRlY2UuZ3JhcGhpYyddLFxuICAgIFsndXZtJywgJ3ZpZGVvL3ZuZC5kZWNlLm1vYmlsZSddLFxuICAgIFsndXZwJywgJ3ZpZGVvL3ZuZC5kZWNlLnBkJ10sXG4gICAgWyd1dnMnLCAndmlkZW8vdm5kLmRlY2Uuc2QnXSxcbiAgICBbJ3V2dCcsICdhcHBsaWNhdGlvbi92bmQuZGVjZS50dG1sK3htbCddLFxuICAgIFsndXZ1JywgJ3ZpZGVvL3ZuZC51dnZ1Lm1wNCddLFxuICAgIFsndXZ2JywgJ3ZpZGVvL3ZuZC5kZWNlLnZpZGVvJ10sXG4gICAgWyd1dnZhJywgJ2F1ZGlvL3ZuZC5kZWNlLmF1ZGlvJ10sXG4gICAgWyd1dnZkJywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLmRhdGEnXSxcbiAgICBbJ3V2dmYnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UuZGF0YSddLFxuICAgIFsndXZ2ZycsICdpbWFnZS92bmQuZGVjZS5ncmFwaGljJ10sXG4gICAgWyd1dnZoJywgJ3ZpZGVvL3ZuZC5kZWNlLmhkJ10sXG4gICAgWyd1dnZpJywgJ2ltYWdlL3ZuZC5kZWNlLmdyYXBoaWMnXSxcbiAgICBbJ3V2dm0nLCAndmlkZW8vdm5kLmRlY2UubW9iaWxlJ10sXG4gICAgWyd1dnZwJywgJ3ZpZGVvL3ZuZC5kZWNlLnBkJ10sXG4gICAgWyd1dnZzJywgJ3ZpZGVvL3ZuZC5kZWNlLnNkJ10sXG4gICAgWyd1dnZ0JywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLnR0bWwreG1sJ10sXG4gICAgWyd1dnZ1JywgJ3ZpZGVvL3ZuZC51dnZ1Lm1wNCddLFxuICAgIFsndXZ2dicsICd2aWRlby92bmQuZGVjZS52aWRlbyddLFxuICAgIFsndXZ2eCcsICdhcHBsaWNhdGlvbi92bmQuZGVjZS51bnNwZWNpZmllZCddLFxuICAgIFsndXZ2eicsICdhcHBsaWNhdGlvbi92bmQuZGVjZS56aXAnXSxcbiAgICBbJ3V2eCcsICdhcHBsaWNhdGlvbi92bmQuZGVjZS51bnNwZWNpZmllZCddLFxuICAgIFsndXZ6JywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLnppcCddLFxuICAgIFsndmJveCcsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdmJveCddLFxuICAgIFsndmJveC1leHRwYWNrJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12Ym94LWV4dHBhY2snXSxcbiAgICBbJ3ZjYXJkJywgJ3RleHQvdmNhcmQnXSxcbiAgICBbJ3ZjZCcsICdhcHBsaWNhdGlvbi94LWNkbGluayddLFxuICAgIFsndmNmJywgJ3RleHQveC12Y2FyZCddLFxuICAgIFsndmNnJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdmNhcmQnXSxcbiAgICBbJ3ZjcycsICd0ZXh0L3gtdmNhbGVuZGFyJ10sXG4gICAgWyd2Y3gnLCAnYXBwbGljYXRpb24vdm5kLnZjeCddLFxuICAgIFsndmRpJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12ZGknXSxcbiAgICBbJ3ZkcycsICdtb2RlbC92bmQuc2FwLnZkcyddLFxuICAgIFsndmhkJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12aGQnXSxcbiAgICBbJ3ZpcycsICdhcHBsaWNhdGlvbi92bmQudmlzaW9uYXJ5J10sXG4gICAgWyd2aXYnLCAndmlkZW8vdm5kLnZpdm8nXSxcbiAgICBbJ3ZsYycsICdhcHBsaWNhdGlvbi92aWRlb2xhbiddLFxuICAgIFsndm1kaycsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdm1kayddLFxuICAgIFsndm9iJywgJ3ZpZGVvL3gtbXMtdm9iJ10sXG4gICAgWyd2b3InLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi53cml0ZXInXSxcbiAgICBbJ3ZveCcsICdhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtYmluJ10sXG4gICAgWyd2cm1sJywgJ21vZGVsL3ZybWwnXSxcbiAgICBbJ3ZzZCcsICdhcHBsaWNhdGlvbi92bmQudmlzaW8nXSxcbiAgICBbJ3ZzZicsICdhcHBsaWNhdGlvbi92bmQudnNmJ10sXG4gICAgWyd2c3MnLCAnYXBwbGljYXRpb24vdm5kLnZpc2lvJ10sXG4gICAgWyd2c3QnLCAnYXBwbGljYXRpb24vdm5kLnZpc2lvJ10sXG4gICAgWyd2c3cnLCAnYXBwbGljYXRpb24vdm5kLnZpc2lvJ10sXG4gICAgWyd2dGYnLCAnaW1hZ2Uvdm5kLnZhbHZlLnNvdXJjZS50ZXh0dXJlJ10sXG4gICAgWyd2dHQnLCAndGV4dC92dHQnXSxcbiAgICBbJ3Z0dScsICdtb2RlbC92bmQudnR1J10sXG4gICAgWyd2eG1sJywgJ2FwcGxpY2F0aW9uL3ZvaWNleG1sK3htbCddLFxuICAgIFsndzNkJywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ3dhZCcsICdhcHBsaWNhdGlvbi94LWRvb20nXSxcbiAgICBbJ3dhZGwnLCAnYXBwbGljYXRpb24vdm5kLnN1bi53YWRsK3htbCddLFxuICAgIFsnd2FyJywgJ2FwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZSddLFxuICAgIFsnd2FzbScsICdhcHBsaWNhdGlvbi93YXNtJ10sXG4gICAgWyd3YXYnLCAnYXVkaW8veC13YXYnXSxcbiAgICBbJ3dheCcsICdhdWRpby94LW1zLXdheCddLFxuICAgIFsnd2JtcCcsICdpbWFnZS92bmQud2FwLndibXAnXSxcbiAgICBbJ3dicycsICdhcHBsaWNhdGlvbi92bmQuY3JpdGljYWx0b29scy53YnMreG1sJ10sXG4gICAgWyd3YnhtbCcsICdhcHBsaWNhdGlvbi93YnhtbCddLFxuICAgIFsnd2NtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JrcyddLFxuICAgIFsnd2RiJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JrcyddLFxuICAgIFsnd2RwJywgJ2ltYWdlL3ZuZC5tcy1waG90byddLFxuICAgIFsnd2ViYScsICdhdWRpby93ZWJtJ10sXG4gICAgWyd3ZWJhcHAnLCAnYXBwbGljYXRpb24veC13ZWItYXBwLW1hbmlmZXN0K2pzb24nXSxcbiAgICBbJ3dlYm0nLCAndmlkZW8vd2VibSddLFxuICAgIFsnd2VibWFuaWZlc3QnLCAnYXBwbGljYXRpb24vbWFuaWZlc3QranNvbiddLFxuICAgIFsnd2VicCcsICdpbWFnZS93ZWJwJ10sXG4gICAgWyd3ZycsICdhcHBsaWNhdGlvbi92bmQucG1pLndpZGdldCddLFxuICAgIFsnd2d0JywgJ2FwcGxpY2F0aW9uL3dpZGdldCddLFxuICAgIFsnd2tzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JrcyddLFxuICAgIFsnd20nLCAndmlkZW8veC1tcy13bSddLFxuICAgIFsnd21hJywgJ2F1ZGlvL3gtbXMtd21hJ10sXG4gICAgWyd3bWQnLCAnYXBwbGljYXRpb24veC1tcy13bWQnXSxcbiAgICBbJ3dtZicsICdpbWFnZS93bWYnXSxcbiAgICBbJ3dtbCcsICd0ZXh0L3ZuZC53YXAud21sJ10sXG4gICAgWyd3bWxjJywgJ2FwcGxpY2F0aW9uL3dtbGMnXSxcbiAgICBbJ3dtbHMnLCAndGV4dC92bmQud2FwLndtbHNjcmlwdCddLFxuICAgIFsnd21sc2MnLCAnYXBwbGljYXRpb24vdm5kLndhcC53bWxzY3JpcHRjJ10sXG4gICAgWyd3bXYnLCAndmlkZW8veC1tcy13bXYnXSxcbiAgICBbJ3dteCcsICd2aWRlby94LW1zLXdteCddLFxuICAgIFsnd216JywgJ2FwcGxpY2F0aW9uL3gtbXNtZXRhZmlsZSddLFxuICAgIFsnd29mZicsICdmb250L3dvZmYnXSxcbiAgICBbJ3dvZmYyJywgJ2ZvbnQvd29mZjInXSxcbiAgICBbJ3dvcmQnLCAnYXBwbGljYXRpb24vbXN3b3JkJ10sXG4gICAgWyd3cGQnLCAnYXBwbGljYXRpb24vdm5kLndvcmRwZXJmZWN0J10sXG4gICAgWyd3cGwnLCAnYXBwbGljYXRpb24vdm5kLm1zLXdwbCddLFxuICAgIFsnd3BzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JrcyddLFxuICAgIFsnd3FkJywgJ2FwcGxpY2F0aW9uL3ZuZC53cWQnXSxcbiAgICBbJ3dyaScsICdhcHBsaWNhdGlvbi94LW1zd3JpdGUnXSxcbiAgICBbJ3dybCcsICdtb2RlbC92cm1sJ10sXG4gICAgWyd3c2MnLCAnbWVzc2FnZS92bmQud2ZhLndzYyddLFxuICAgIFsnd3NkbCcsICdhcHBsaWNhdGlvbi93c2RsK3htbCddLFxuICAgIFsnd3Nwb2xpY3knLCAnYXBwbGljYXRpb24vd3Nwb2xpY3kreG1sJ10sXG4gICAgWyd3dGInLCAnYXBwbGljYXRpb24vdm5kLndlYnR1cmJvJ10sXG4gICAgWyd3dngnLCAndmlkZW8veC1tcy13dngnXSxcbiAgICBbJ3gzZCcsICdtb2RlbC94M2QreG1sJ10sXG4gICAgWyd4M2RiJywgJ21vZGVsL3gzZCtmYXN0aW5mb3NldCddLFxuICAgIFsneDNkYnonLCAnbW9kZWwveDNkK2JpbmFyeSddLFxuICAgIFsneDNkdicsICdtb2RlbC94M2QtdnJtbCddLFxuICAgIFsneDNkdnonLCAnbW9kZWwveDNkK3ZybWwnXSxcbiAgICBbJ3gzZHonLCAnbW9kZWwveDNkK3htbCddLFxuICAgIFsneDMyJywgJ2FwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1iaW4nXSxcbiAgICBbJ3hfYicsICdtb2RlbC92bmQucGFyYXNvbGlkLnRyYW5zbWl0LmJpbmFyeSddLFxuICAgIFsneF90JywgJ21vZGVsL3ZuZC5wYXJhc29saWQudHJhbnNtaXQudGV4dCddLFxuICAgIFsneGFtbCcsICdhcHBsaWNhdGlvbi94YW1sK3htbCddLFxuICAgIFsneGFwJywgJ2FwcGxpY2F0aW9uL3gtc2lsdmVybGlnaHQtYXBwJ10sXG4gICAgWyd4YXInLCAnYXBwbGljYXRpb24vdm5kLnhhcmEnXSxcbiAgICBbJ3hhdicsICdhcHBsaWNhdGlvbi94Y2FwLWF0dCt4bWwnXSxcbiAgICBbJ3hiYXAnLCAnYXBwbGljYXRpb24veC1tcy14YmFwJ10sXG4gICAgWyd4YmQnLCAnYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kb2N1d29ya3MuYmluZGVyJ10sXG4gICAgWyd4Ym0nLCAnaW1hZ2UveC14Yml0bWFwJ10sXG4gICAgWyd4Y2EnLCAnYXBwbGljYXRpb24veGNhcC1jYXBzK3htbCddLFxuICAgIFsneGNzJywgJ2FwcGxpY2F0aW9uL2NhbGVuZGFyK3htbCddLFxuICAgIFsneGRmJywgJ2FwcGxpY2F0aW9uL3hjYXAtZGlmZit4bWwnXSxcbiAgICBbJ3hkbScsICdhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3htbCddLFxuICAgIFsneGRwJywgJ2FwcGxpY2F0aW9uL3ZuZC5hZG9iZS54ZHAreG1sJ10sXG4gICAgWyd4ZHNzYycsICdhcHBsaWNhdGlvbi9kc3NjK3htbCddLFxuICAgIFsneGR3JywgJ2FwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZG9jdXdvcmtzJ10sXG4gICAgWyd4ZWwnLCAnYXBwbGljYXRpb24veGNhcC1lbCt4bWwnXSxcbiAgICBbJ3hlbmMnLCAnYXBwbGljYXRpb24veGVuYyt4bWwnXSxcbiAgICBbJ3hlcicsICdhcHBsaWNhdGlvbi9wYXRjaC1vcHMtZXJyb3IreG1sJ10sXG4gICAgWyd4ZmRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5hZG9iZS54ZmRmJ10sXG4gICAgWyd4ZmRsJywgJ2FwcGxpY2F0aW9uL3ZuZC54ZmRsJ10sXG4gICAgWyd4aHQnLCAnYXBwbGljYXRpb24veGh0bWwreG1sJ10sXG4gICAgWyd4aHRtbCcsICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnXSxcbiAgICBbJ3hodm1sJywgJ2FwcGxpY2F0aW9uL3h2K3htbCddLFxuICAgIFsneGlmJywgJ2ltYWdlL3ZuZC54aWZmJ10sXG4gICAgWyd4bCcsICdhcHBsaWNhdGlvbi9leGNlbCddLFxuICAgIFsneGxhJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCddLFxuICAgIFsneGxhbScsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWyd4bGMnLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ10sXG4gICAgWyd4bGYnLCAnYXBwbGljYXRpb24veGxpZmYreG1sJ10sXG4gICAgWyd4bG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ10sXG4gICAgWyd4bHMnLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ10sXG4gICAgWyd4bHNiJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWyd4bHNtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3hsc3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnXSxcbiAgICBbJ3hsdCcsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3hsdG0nLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsneGx0eCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZSddLFxuICAgIFsneGx3JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCddLFxuICAgIFsneG0nLCAnYXVkaW8veG0nXSxcbiAgICBbJ3htbCcsICdhcHBsaWNhdGlvbi94bWwnXSxcbiAgICBbJ3hucycsICdhcHBsaWNhdGlvbi94Y2FwLW5zK3htbCddLFxuICAgIFsneG8nLCAnYXBwbGljYXRpb24vdm5kLm9scGMtc3VnYXInXSxcbiAgICBbJ3hvcCcsICdhcHBsaWNhdGlvbi94b3AreG1sJ10sXG4gICAgWyd4cGknLCAnYXBwbGljYXRpb24veC14cGluc3RhbGwnXSxcbiAgICBbJ3hwbCcsICdhcHBsaWNhdGlvbi94cHJvYyt4bWwnXSxcbiAgICBbJ3hwbScsICdpbWFnZS94LXhwaXhtYXAnXSxcbiAgICBbJ3hwcicsICdhcHBsaWNhdGlvbi92bmQuaXMteHByJ10sXG4gICAgWyd4cHMnLCAnYXBwbGljYXRpb24vdm5kLm1zLXhwc2RvY3VtZW50J10sXG4gICAgWyd4cHcnLCAnYXBwbGljYXRpb24vdm5kLmludGVyY29uLmZvcm1uZXQnXSxcbiAgICBbJ3hweCcsICdhcHBsaWNhdGlvbi92bmQuaW50ZXJjb24uZm9ybW5ldCddLFxuICAgIFsneHNkJywgJ2FwcGxpY2F0aW9uL3htbCddLFxuICAgIFsneHNsJywgJ2FwcGxpY2F0aW9uL3htbCddLFxuICAgIFsneHNsdCcsICdhcHBsaWNhdGlvbi94c2x0K3htbCddLFxuICAgIFsneHNtJywgJ2FwcGxpY2F0aW9uL3ZuZC5zeW5jbWwreG1sJ10sXG4gICAgWyd4c3BmJywgJ2FwcGxpY2F0aW9uL3hzcGYreG1sJ10sXG4gICAgWyd4dWwnLCAnYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbCddLFxuICAgIFsneHZtJywgJ2FwcGxpY2F0aW9uL3h2K3htbCddLFxuICAgIFsneHZtbCcsICdhcHBsaWNhdGlvbi94dit4bWwnXSxcbiAgICBbJ3h3ZCcsICdpbWFnZS94LXh3aW5kb3dkdW1wJ10sXG4gICAgWyd4eXonLCAnY2hlbWljYWwveC14eXonXSxcbiAgICBbJ3h6JywgJ2FwcGxpY2F0aW9uL3gteHonXSxcbiAgICBbJ3lhbWwnLCAndGV4dC95YW1sJ10sXG4gICAgWyd5YW5nJywgJ2FwcGxpY2F0aW9uL3lhbmcnXSxcbiAgICBbJ3lpbicsICdhcHBsaWNhdGlvbi95aW4reG1sJ10sXG4gICAgWyd5bWwnLCAndGV4dC95YW1sJ10sXG4gICAgWyd5bXAnLCAndGV4dC94LXN1c2UteW1wJ10sXG4gICAgWyd6JywgJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3MnXSxcbiAgICBbJ3oxJywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3oyJywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3ozJywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3o0JywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3o1JywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3o2JywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3o3JywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3o4JywgJ2FwcGxpY2F0aW9uL3gtem1hY2hpbmUnXSxcbiAgICBbJ3pheicsICdhcHBsaWNhdGlvbi92bmQuenphenouZGVjayt4bWwnXSxcbiAgICBbJ3ppcCcsICdhcHBsaWNhdGlvbi96aXAnXSxcbiAgICBbJ3ppcicsICdhcHBsaWNhdGlvbi92bmQuenVsJ10sXG4gICAgWyd6aXJ6JywgJ2FwcGxpY2F0aW9uL3ZuZC56dWwnXSxcbiAgICBbJ3ptbScsICdhcHBsaWNhdGlvbi92bmQuaGFuZGhlbGQtZW50ZXJ0YWlubWVudCt4bWwnXSxcbiAgICBbJ3pzaCcsICd0ZXh0L3gtc2NyaXB0enNoJ11cbl0pO1xuZnVuY3Rpb24gdG9GaWxlV2l0aFBhdGgoZmlsZSwgcGF0aCwgaCkge1xuICAgIHZhciBmID0gd2l0aE1pbWVUeXBlKGZpbGUpO1xuICAgIHZhciB3ZWJraXRSZWxhdGl2ZVBhdGggPSBmaWxlLndlYmtpdFJlbGF0aXZlUGF0aDtcbiAgICB2YXIgcCA9IHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHBhdGhcbiAgICAgICAgLy8gSWYgPGlucHV0IHdlYmtpdGRpcmVjdG9yeT4gaXMgc2V0LFxuICAgICAgICAvLyB0aGUgRmlsZSB3aWxsIGhhdmUgYSB7d2Via2l0UmVsYXRpdmVQYXRofSBwcm9wZXJ0eVxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTElucHV0RWxlbWVudC93ZWJraXRkaXJlY3RvcnlcbiAgICAgICAgOiB0eXBlb2Ygd2Via2l0UmVsYXRpdmVQYXRoID09PSAnc3RyaW5nJyAmJiB3ZWJraXRSZWxhdGl2ZVBhdGgubGVuZ3RoID4gMFxuICAgICAgICAgICAgPyB3ZWJraXRSZWxhdGl2ZVBhdGhcbiAgICAgICAgICAgIDogXCIuL1wiLmNvbmNhdChmaWxlLm5hbWUpO1xuICAgIGlmICh0eXBlb2YgZi5wYXRoICE9PSAnc3RyaW5nJykgeyAvLyBvbiBlbGVjdHJvbiwgcGF0aCBpcyBhbHJlYWR5IHNldCB0byB0aGUgYWJzb2x1dGUgcGF0aFxuICAgICAgICBzZXRPYmpQcm9wKGYsICdwYXRoJywgcCk7XG4gICAgfVxuICAgIGlmIChoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsICdoYW5kbGUnLCB7XG4gICAgICAgICAgICB2YWx1ZTogaCxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBBbHdheXMgcG9wdWxhdGUgYSByZWxhdGl2ZSBwYXRoIHNvIHRoYXQgZXZlbiBlbGVjdHJvbiBhcHBzIGhhdmUgYWNjZXNzIHRvIGEgcmVsYXRpdmVQYXRoIHZhbHVlXG4gICAgc2V0T2JqUHJvcChmLCAncmVsYXRpdmVQYXRoJywgcCk7XG4gICAgcmV0dXJuIGY7XG59XG5mdW5jdGlvbiB3aXRoTWltZVR5cGUoZmlsZSkge1xuICAgIHZhciBuYW1lID0gZmlsZS5uYW1lO1xuICAgIHZhciBoYXNFeHRlbnNpb24gPSBuYW1lICYmIG5hbWUubGFzdEluZGV4T2YoJy4nKSAhPT0gLTE7XG4gICAgaWYgKGhhc0V4dGVuc2lvbiAmJiAhZmlsZS50eXBlKSB7XG4gICAgICAgIHZhciBleHQgPSBuYW1lLnNwbGl0KCcuJylcbiAgICAgICAgICAgIC5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB2YXIgdHlwZSA9IGV4cG9ydHMuQ09NTU9OX01JTUVfVFlQRVMuZ2V0KGV4dCk7XG4gICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZmlsZSwgJ3R5cGUnLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHR5cGUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpbGU7XG59XG5mdW5jdGlvbiBzZXRPYmpQcm9wKGYsIGtleSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwga2V5LCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3JlYWQgPSAodGhpcyAmJiB0aGlzLl9fcmVhZCkgfHwgZnVuY3Rpb24gKG8sIG4pIHtcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XG4gICAgaWYgKCFtKSByZXR1cm4gbztcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgICB0cnkge1xuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIGFyO1xufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZnJvbUV2ZW50ID0gZnJvbUV2ZW50O1xudmFyIGZpbGVfMSA9IHJlcXVpcmUoXCIuL2ZpbGVcIik7XG52YXIgRklMRVNfVE9fSUdOT1JFID0gW1xuICAgIC8vIFRodW1ibmFpbCBjYWNoZSBmaWxlcyBmb3IgbWFjT1MgYW5kIFdpbmRvd3NcbiAgICAnLkRTX1N0b3JlJywgLy8gbWFjT3NcbiAgICAnVGh1bWJzLmRiJyAvLyBXaW5kb3dzXG5dO1xuLyoqXG4gKiBDb252ZXJ0IGEgRHJhZ0V2ZW50J3MgRGF0YVRyYXNmZXIgb2JqZWN0IHRvIGEgbGlzdCBvZiBGaWxlIG9iamVjdHNcbiAqIE5PVEU6IElmIHNvbWUgb2YgdGhlIGl0ZW1zIGFyZSBmb2xkZXJzLFxuICogZXZlcnl0aGluZyB3aWxsIGJlIGZsYXR0ZW5lZCBhbmQgcGxhY2VkIGluIHRoZSBzYW1lIGxpc3QgYnV0IHRoZSBwYXRocyB3aWxsIGJlIGtlcHQgYXMgYSB7cGF0aH0gcHJvcGVydHkuXG4gKlxuICogRVhQRVJJTUVOVEFMOiBBIGxpc3Qgb2YgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1IYW5kbGUgb2JqZWN0cyBjYW4gYWxzbyBiZSBwYXNzZWQgYXMgYW4gYXJnXG4gKiBhbmQgYSBsaXN0IG9mIEZpbGUgb2JqZWN0cyB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBldnRcbiAqL1xuZnVuY3Rpb24gZnJvbUV2ZW50KGV2dCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGV2dCkgJiYgaXNEYXRhVHJhbnNmZXIoZXZ0LmRhdGFUcmFuc2ZlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZ2V0RGF0YVRyYW5zZmVyRmlsZXMoZXZ0LmRhdGFUcmFuc2ZlciwgZXZ0LnR5cGUpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzQ2hhbmdlRXZ0KGV2dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZ2V0SW5wdXRGaWxlcyhldnQpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXZ0KSAmJiBldnQuZXZlcnkoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuICdnZXRGaWxlJyBpbiBpdGVtICYmIHR5cGVvZiBpdGVtLmdldEZpbGUgPT09ICdmdW5jdGlvbic7IH0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGdldEZzSGFuZGxlRmlsZXMoZXZ0KV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgW11dO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGlzRGF0YVRyYW5zZmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGlzQ2hhbmdlRXZ0KHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBpc09iamVjdCh2YWx1ZS50YXJnZXQpO1xufVxuZnVuY3Rpb24gaXNPYmplY3Qodikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PT0gJ29iamVjdCcgJiYgdiAhPT0gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldElucHV0RmlsZXMoZXZ0KSB7XG4gICAgcmV0dXJuIGZyb21MaXN0KGV2dC50YXJnZXQuZmlsZXMpLm1hcChmdW5jdGlvbiAoZmlsZSkgeyByZXR1cm4gKDAsIGZpbGVfMS50b0ZpbGVXaXRoUGF0aCkoZmlsZSk7IH0pO1xufVxuLy8gRWUgZXhwZWN0IGVhY2ggaGFuZGxlIHRvIGJlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRmlsZUhhbmRsZVxuZnVuY3Rpb24gZ2V0RnNIYW5kbGVGaWxlcyhoYW5kbGVzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmlsZXM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIFByb21pc2UuYWxsKGhhbmRsZXMubWFwKGZ1bmN0aW9uIChoKSB7IHJldHVybiBoLmdldEZpbGUoKTsgfSkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZmlsZXMubWFwKGZ1bmN0aW9uIChmaWxlKSB7IHJldHVybiAoMCwgZmlsZV8xLnRvRmlsZVdpdGhQYXRoKShmaWxlKTsgfSldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldERhdGFUcmFuc2ZlckZpbGVzKGR0LCB0eXBlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXRlbXMsIGZpbGVzO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWR0Lml0ZW1zKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBmcm9tTGlzdChkdC5pdGVtcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0ua2luZCA9PT0gJ2ZpbGUnOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWNjb3JkaW5nIHRvIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2RuZC5odG1sI2RuZGV2ZW50cyxcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSAnZHJhZ3N0YXJ0JyBhbmQgJ2Ryb3AnIGhhcyBhY2Nlc3MgdG8gdGhlIGRhdGEgKHNvdXJjZSBub2RlKVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Ryb3AnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgaXRlbXNdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIFByb21pc2UuYWxsKGl0ZW1zLm1hcCh0b0ZpbGVQcm9taXNlcykpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbm9JZ25vcmVkRmlsZXMoZmxhdHRlbihmaWxlcykpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiAvKnJldHVybiovLCBub0lnbm9yZWRGaWxlcyhmcm9tTGlzdChkdC5maWxlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGZpbGUpIHsgcmV0dXJuICgwLCBmaWxlXzEudG9GaWxlV2l0aFBhdGgpKGZpbGUpOyB9KSldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5vSWdub3JlZEZpbGVzKGZpbGVzKSB7XG4gICAgcmV0dXJuIGZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkgeyByZXR1cm4gRklMRVNfVE9fSUdOT1JFLmluZGV4T2YoZmlsZS5uYW1lKSA9PT0gLTE7IH0pO1xufVxuLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IEFycmF5LmZyb20oKVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZnJvbSNCcm93c2VyX2NvbXBhdGliaWxpdHlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlTGlzdFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RhdGFUcmFuc2Zlckl0ZW1MaXN0XG5mdW5jdGlvbiBmcm9tTGlzdChpdGVtcykge1xuICAgIGlmIChpdGVtcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHZhciBmaWxlcyA9IFtdO1xuICAgIC8vIHRzbGludDpkaXNhYmxlOiBwcmVmZXItZm9yLW9mXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZmlsZSA9IGl0ZW1zW2ldO1xuICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgIH1cbiAgICByZXR1cm4gZmlsZXM7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRGF0YVRyYW5zZmVySXRlbVxuZnVuY3Rpb24gdG9GaWxlUHJvbWlzZXMoaXRlbSkge1xuICAgIGlmICh0eXBlb2YgaXRlbS53ZWJraXRHZXRBc0VudHJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBmcm9tRGF0YVRyYW5zZmVySXRlbShpdGVtKTtcbiAgICB9XG4gICAgdmFyIGVudHJ5ID0gaXRlbS53ZWJraXRHZXRBc0VudHJ5KCk7XG4gICAgLy8gU2FmYXJpIHN1cHBvcnRzIGRyb3BwaW5nIGFuIGltYWdlIG5vZGUgZnJvbSBhIGRpZmZlcmVudCB3aW5kb3cgYW5kIGNhbiBiZSByZXRyaWV2ZWQgdXNpbmdcbiAgICAvLyB0aGUgRGF0YVRyYW5zZmVySXRlbS5nZXRBc0ZpbGUoKSBBUElcbiAgICAvLyBOT1RFOiBGaWxlU3lzdGVtRW50cnkuZmlsZSgpIHRocm93cyBpZiB0cnlpbmcgdG8gZ2V0IHRoZSBmaWxlXG4gICAgaWYgKGVudHJ5ICYmIGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICAgIHJldHVybiBmcm9tRGlyRW50cnkoZW50cnkpO1xuICAgIH1cbiAgICByZXR1cm4gZnJvbURhdGFUcmFuc2Zlckl0ZW0oaXRlbSwgZW50cnkpO1xufVxuZnVuY3Rpb24gZmxhdHRlbihpdGVtcykge1xuICAgIHJldHVybiBpdGVtcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZmlsZXMpIHsgcmV0dXJuIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFjYyksIGZhbHNlKSwgX19yZWFkKChBcnJheS5pc0FycmF5KGZpbGVzKSA/IGZsYXR0ZW4oZmlsZXMpIDogW2ZpbGVzXSkpLCBmYWxzZSk7IH0sIFtdKTtcbn1cbmZ1bmN0aW9uIGZyb21EYXRhVHJhbnNmZXJJdGVtKGl0ZW0sIGVudHJ5KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaCwgZmlsZV8yLCBmaWxlLCBmd3A7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZ2xvYmFsVGhpcy5pc1NlY3VyZUNvbnRleHQgJiYgdHlwZW9mIGl0ZW0uZ2V0QXNGaWxlU3lzdGVtSGFuZGxlID09PSAnZnVuY3Rpb24nKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGl0ZW0uZ2V0QXNGaWxlU3lzdGVtSGFuZGxlKCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgaCA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlwiLmNvbmNhdChpdGVtLCBcIiBpcyBub3QgYSBGaWxlXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIShoICE9PSB1bmRlZmluZWQpKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaC5nZXRGaWxlKCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgZmlsZV8yID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBmaWxlXzIuaGFuZGxlID0gaDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sICgwLCBmaWxlXzEudG9GaWxlV2l0aFBhdGgpKGZpbGVfMildO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCIuY29uY2F0KGl0ZW0sIFwiIGlzIG5vdCBhIEZpbGVcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZ3cCA9ICgwLCBmaWxlXzEudG9GaWxlV2l0aFBhdGgpKGZpbGUsIChfYSA9IGVudHJ5ID09PSBudWxsIHx8IGVudHJ5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbnRyeS5mdWxsUGF0aCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGZ3cF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1FbnRyeVxuZnVuY3Rpb24gZnJvbUVudHJ5KGVudHJ5KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZW50cnkuaXNEaXJlY3RvcnkgPyBmcm9tRGlyRW50cnkoZW50cnkpIDogZnJvbUZpbGVFbnRyeShlbnRyeSldO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRGlyZWN0b3J5RW50cnlcbmZ1bmN0aW9uIGZyb21EaXJFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWFkZXIgPSBlbnRyeS5jcmVhdGVSZWFkZXIoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgZW50cmllcyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiByZWFkRW50cmllcygpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbURpcmVjdG9yeUVudHJ5L2NyZWF0ZVJlYWRlclxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1EaXJlY3RvcnlSZWFkZXIvcmVhZEVudHJpZXNcbiAgICAgICAgICAgIHJlYWRlci5yZWFkRW50cmllcyhmdW5jdGlvbiAoYmF0Y2gpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZXMsIGVycl8xLCBpdGVtcztcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFiYXRjaC5sZW5ndGgpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIFByb21pc2UuYWxsKGVudHJpZXMpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzMgLypicmVhayovLCA2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IFByb21pc2UuYWxsKGJhdGNoLm1hcChmcm9tRW50cnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnRpbnVlIHJlYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkRW50cmllcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTsgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVhZEVudHJpZXMoKTtcbiAgICB9KTtcbn1cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRmlsZUVudHJ5XG5mdW5jdGlvbiBmcm9tRmlsZUVudHJ5KGVudHJ5KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZndwID0gKDAsIGZpbGVfMS50b0ZpbGVXaXRoUGF0aCkoZmlsZSwgZW50cnkuZnVsbFBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmd3ApO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSldO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbGUtc2VsZWN0b3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyb21FdmVudCA9IHZvaWQgMDtcbnZhciBmaWxlX3NlbGVjdG9yXzEgPSByZXF1aXJlKFwiLi9maWxlLXNlbGVjdG9yXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZnJvbUV2ZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBmaWxlX3NlbGVjdG9yXzEuZnJvbUV2ZW50OyB9IH0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwibW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oZSl7dmFyIHI9e307ZnVuY3Rpb24gdChuKXtpZihyW25dKXJldHVybiByW25dLmV4cG9ydHM7dmFyIG89cltuXT17aTpuLGw6ITEsZXhwb3J0czp7fX07cmV0dXJuIGVbbl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsdCksby5sPSEwLG8uZXhwb3J0c31yZXR1cm4gdC5tPWUsdC5jPXIsdC5kPWZ1bmN0aW9uKGUscixuKXt0Lm8oZSxyKXx8T2JqZWN0LmRlZmluZVByb3BlcnR5KGUscix7ZW51bWVyYWJsZTohMCxnZXQ6bn0pfSx0LnI9ZnVuY3Rpb24oZSl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLnRvU3RyaW5nVGFnJiZPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOlwiTW9kdWxlXCJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0sdC50PWZ1bmN0aW9uKGUscil7aWYoMSZyJiYoZT10KGUpKSw4JnIpcmV0dXJuIGU7aWYoNCZyJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmZSYmZS5fX2VzTW9kdWxlKXJldHVybiBlO3ZhciBuPU9iamVjdC5jcmVhdGUobnVsbCk7aWYodC5yKG4pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiZGVmYXVsdFwiLHtlbnVtZXJhYmxlOiEwLHZhbHVlOmV9KSwyJnImJlwic3RyaW5nXCIhPXR5cGVvZiBlKWZvcih2YXIgbyBpbiBlKXQuZChuLG8sZnVuY3Rpb24ocil7cmV0dXJuIGVbcl19LmJpbmQobnVsbCxvKSk7cmV0dXJuIG59LHQubj1mdW5jdGlvbihlKXt2YXIgcj1lJiZlLl9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gZS5kZWZhdWx0fTpmdW5jdGlvbigpe3JldHVybiBlfTtyZXR1cm4gdC5kKHIsXCJhXCIscikscn0sdC5vPWZ1bmN0aW9uKGUscil7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLHIpfSx0LnA9XCJcIix0KHQucz0wKX0oW2Z1bmN0aW9uKGUscix0KXtcInVzZSBzdHJpY3RcIjtyLl9fZXNNb2R1bGU9ITAsci5kZWZhdWx0PWZ1bmN0aW9uKGUscil7aWYoZSYmcil7dmFyIHQ9QXJyYXkuaXNBcnJheShyKT9yOnIuc3BsaXQoXCIsXCIpO2lmKDA9PT10Lmxlbmd0aClyZXR1cm4hMDt2YXIgbj1lLm5hbWV8fFwiXCIsbz0oZS50eXBlfHxcIlwiKS50b0xvd2VyQ2FzZSgpLHU9by5yZXBsYWNlKC9cXC8uKiQvLFwiXCIpO3JldHVybiB0LnNvbWUoKGZ1bmN0aW9uKGUpe3ZhciByPWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCIuXCI9PT1yLmNoYXJBdCgwKT9uLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgocik6ci5lbmRzV2l0aChcIi8qXCIpP3U9PT1yLnJlcGxhY2UoL1xcLy4qJC8sXCJcIik6bz09PXJ9KSl9cmV0dXJuITB9fV0pOyIsImZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBlbnVtZXJhYmxlT25seSAmJiAoc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pKSwga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBudWxsICE9IGFyZ3VtZW50c1tpXSA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpICUgMiA/IG93bktleXMoT2JqZWN0KHNvdXJjZSksICEwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7IH0pIDogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpIDogb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgcmV0dXJuIF90eXBlb2YgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9LCBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9pID0gYXJyID09IG51bGwgPyBudWxsIDogdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcnJbU3ltYm9sLml0ZXJhdG9yXSB8fCBhcnJbXCJAQGl0ZXJhdG9yXCJdOyBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9zLCBfZTsgdHJ5IHsgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5pbXBvcnQgX2FjY2VwdHMgZnJvbSBcImF0dHItYWNjZXB0XCI7XG52YXIgYWNjZXB0cyA9IHR5cGVvZiBfYWNjZXB0cyA9PT0gXCJmdW5jdGlvblwiID8gX2FjY2VwdHMgOiBfYWNjZXB0cy5kZWZhdWx0OyAvLyBFcnJvciBjb2Rlc1xuXG5leHBvcnQgdmFyIEZJTEVfSU5WQUxJRF9UWVBFID0gXCJmaWxlLWludmFsaWQtdHlwZVwiO1xuZXhwb3J0IHZhciBGSUxFX1RPT19MQVJHRSA9IFwiZmlsZS10b28tbGFyZ2VcIjtcbmV4cG9ydCB2YXIgRklMRV9UT09fU01BTEwgPSBcImZpbGUtdG9vLXNtYWxsXCI7XG5leHBvcnQgdmFyIFRPT19NQU5ZX0ZJTEVTID0gXCJ0b28tbWFueS1maWxlc1wiO1xuZXhwb3J0IHZhciBFcnJvckNvZGUgPSB7XG4gIEZpbGVJbnZhbGlkVHlwZTogRklMRV9JTlZBTElEX1RZUEUsXG4gIEZpbGVUb29MYXJnZTogRklMRV9UT09fTEFSR0UsXG4gIEZpbGVUb29TbWFsbDogRklMRV9UT09fU01BTEwsXG4gIFRvb01hbnlGaWxlczogVE9PX01BTllfRklMRVNcbn07XG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYWNjZXB0XG4gKi9cblxuZXhwb3J0IHZhciBnZXRJbnZhbGlkVHlwZVJlamVjdGlvbkVyciA9IGZ1bmN0aW9uIGdldEludmFsaWRUeXBlUmVqZWN0aW9uRXJyKCkge1xuICB2YXIgYWNjZXB0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBcIlwiO1xuICB2YXIgYWNjZXB0QXJyID0gYWNjZXB0LnNwbGl0KFwiLFwiKTtcbiAgdmFyIG1zZyA9IGFjY2VwdEFyci5sZW5ndGggPiAxID8gXCJvbmUgb2YgXCIuY29uY2F0KGFjY2VwdEFyci5qb2luKFwiLCBcIikpIDogYWNjZXB0QXJyWzBdO1xuICByZXR1cm4ge1xuICAgIGNvZGU6IEZJTEVfSU5WQUxJRF9UWVBFLFxuICAgIG1lc3NhZ2U6IFwiRmlsZSB0eXBlIG11c3QgYmUgXCIuY29uY2F0KG1zZylcbiAgfTtcbn07XG5leHBvcnQgdmFyIGdldFRvb0xhcmdlUmVqZWN0aW9uRXJyID0gZnVuY3Rpb24gZ2V0VG9vTGFyZ2VSZWplY3Rpb25FcnIobWF4U2l6ZSkge1xuICByZXR1cm4ge1xuICAgIGNvZGU6IEZJTEVfVE9PX0xBUkdFLFxuICAgIG1lc3NhZ2U6IFwiRmlsZSBpcyBsYXJnZXIgdGhhbiBcIi5jb25jYXQobWF4U2l6ZSwgXCIgXCIpLmNvbmNhdChtYXhTaXplID09PSAxID8gXCJieXRlXCIgOiBcImJ5dGVzXCIpXG4gIH07XG59O1xuZXhwb3J0IHZhciBnZXRUb29TbWFsbFJlamVjdGlvbkVyciA9IGZ1bmN0aW9uIGdldFRvb1NtYWxsUmVqZWN0aW9uRXJyKG1pblNpemUpIHtcbiAgcmV0dXJuIHtcbiAgICBjb2RlOiBGSUxFX1RPT19TTUFMTCxcbiAgICBtZXNzYWdlOiBcIkZpbGUgaXMgc21hbGxlciB0aGFuIFwiLmNvbmNhdChtaW5TaXplLCBcIiBcIikuY29uY2F0KG1pblNpemUgPT09IDEgPyBcImJ5dGVcIiA6IFwiYnl0ZXNcIilcbiAgfTtcbn07XG5leHBvcnQgdmFyIFRPT19NQU5ZX0ZJTEVTX1JFSkVDVElPTiA9IHtcbiAgY29kZTogVE9PX01BTllfRklMRVMsXG4gIG1lc3NhZ2U6IFwiVG9vIG1hbnkgZmlsZXNcIlxufTtcbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIGZpbGUgaXMgYSBEYXRhVHJhbnNmZXJJdGVtIHdpdGggYW4gZW1wdHkgdHlwZS5cbiAqXG4gKiBEdXJpbmcgZHJhZyBldmVudHMsIGJyb3dzZXJzIG1heSByZXR1cm4gRGF0YVRyYW5zZmVySXRlbSBvYmplY3RzIGluc3RlYWQgb2YgRmlsZSBvYmplY3RzLlxuICogU29tZSBicm93c2VycyAoZS5nLiwgQ2hyb21lKSByZXR1cm4gYW4gZW1wdHkgTUlNRSB0eXBlIGZvciBjZXJ0YWluIGZpbGUgdHlwZXMgKGxpa2UgLm1kIGZpbGVzKVxuICogb24gRGF0YVRyYW5zZmVySXRlbSBkdXJpbmcgZHJhZyBldmVudHMsIGV2ZW4gdGhvdWdoIHRoZSB0eXBlIGlzIGNvcnJlY3RseSBzZXQgZHVyaW5nIGRyb3AuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBkZXRlY3RzIHN1Y2ggY2FzZXMgYnkgY2hlY2tpbmcgZm9yOlxuICogMS4gRW1wdHkgdHlwZSBzdHJpbmdcbiAqIDIuIFByZXNlbmNlIG9mIGdldEFzRmlsZSBtZXRob2QgKGluZGljYXRlcyBpdCdzIGEgRGF0YVRyYW5zZmVySXRlbSwgbm90IGEgRmlsZSlcbiAqXG4gKiBXZSBhY2NlcHQgdGhlc2UgZHVyaW5nIGRyYWcgdG8gcHJvdmlkZSBwcm9wZXIgVUkgZmVlZGJhY2ssIHdoaWxlIG1haW50YWluaW5nXG4gKiBzdHJpY3QgdmFsaWRhdGlvbiBkdXJpbmcgZHJvcCB3aGVuIHJlYWwgRmlsZSBvYmplY3RzIGFyZSBhdmFpbGFibGUuXG4gKlxuICogQHBhcmFtIHtGaWxlIHwgRGF0YVRyYW5zZmVySXRlbX0gZmlsZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YVRyYW5zZmVySXRlbVdpdGhFbXB0eVR5cGUoZmlsZSkge1xuICByZXR1cm4gZmlsZS50eXBlID09PSBcIlwiICYmIHR5cGVvZiBmaWxlLmdldEFzRmlsZSA9PT0gXCJmdW5jdGlvblwiO1xufVxuLyoqXG4gKiBDaGVjayBpZiBmaWxlIGlzIGFjY2VwdGVkLlxuICpcbiAqIEZpcmVmb3ggdmVyc2lvbnMgcHJpb3IgdG8gNTMgcmV0dXJuIGEgYm9ndXMgTUlNRSB0eXBlIGZvciBldmVyeSBmaWxlIGRyYWcsXG4gKiBzbyBkcmFnb3ZlcnMgd2l0aCB0aGF0IE1JTUUgdHlwZSB3aWxsIGFsd2F5cyBiZSBhY2NlcHRlZC5cbiAqXG4gKiBDaHJvbWUvb3RoZXIgYnJvd3NlcnMgbWF5IHJldHVybiBhbiBlbXB0eSBNSU1FIHR5cGUgZm9yIGZpbGVzIGR1cmluZyBkcmFnIGV2ZW50cyxcbiAqIHNvIHdlIGFjY2VwdCB0aG9zZSBhcyB3ZWxsICh3ZSdsbCB2YWxpZGF0ZSBwcm9wZXJseSBvbiBkcm9wKS5cbiAqXG4gKiBAcGFyYW0ge0ZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm5zXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVBY2NlcHRlZChmaWxlLCBhY2NlcHQpIHtcbiAgdmFyIGlzQWNjZXB0YWJsZSA9IGZpbGUudHlwZSA9PT0gXCJhcHBsaWNhdGlvbi94LW1vei1maWxlXCIgfHwgYWNjZXB0cyhmaWxlLCBhY2NlcHQpIHx8IGlzRGF0YVRyYW5zZmVySXRlbVdpdGhFbXB0eVR5cGUoZmlsZSk7XG4gIHJldHVybiBbaXNBY2NlcHRhYmxlLCBpc0FjY2VwdGFibGUgPyBudWxsIDogZ2V0SW52YWxpZFR5cGVSZWplY3Rpb25FcnIoYWNjZXB0KV07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsZU1hdGNoU2l6ZShmaWxlLCBtaW5TaXplLCBtYXhTaXplKSB7XG4gIGlmIChpc0RlZmluZWQoZmlsZS5zaXplKSkge1xuICAgIGlmIChpc0RlZmluZWQobWluU2l6ZSkgJiYgaXNEZWZpbmVkKG1heFNpemUpKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gbWF4U2l6ZSkgcmV0dXJuIFtmYWxzZSwgZ2V0VG9vTGFyZ2VSZWplY3Rpb25FcnIobWF4U2l6ZSldO1xuICAgICAgaWYgKGZpbGUuc2l6ZSA8IG1pblNpemUpIHJldHVybiBbZmFsc2UsIGdldFRvb1NtYWxsUmVqZWN0aW9uRXJyKG1pblNpemUpXTtcbiAgICB9IGVsc2UgaWYgKGlzRGVmaW5lZChtaW5TaXplKSAmJiBmaWxlLnNpemUgPCBtaW5TaXplKSByZXR1cm4gW2ZhbHNlLCBnZXRUb29TbWFsbFJlamVjdGlvbkVycihtaW5TaXplKV07ZWxzZSBpZiAoaXNEZWZpbmVkKG1heFNpemUpICYmIGZpbGUuc2l6ZSA+IG1heFNpemUpIHJldHVybiBbZmFsc2UsIGdldFRvb0xhcmdlUmVqZWN0aW9uRXJyKG1heFNpemUpXTtcbiAgfVxuXG4gIHJldHVybiBbdHJ1ZSwgbnVsbF07XG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0ZpbGVbXX0gb3B0aW9ucy5maWxlc1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmFjY2VwdF1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5taW5TaXplXVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFNpemVdXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm11bHRpcGxlXVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heEZpbGVzXVxuICogQHBhcmFtIHsoZjogRmlsZSkgPT4gRmlsZUVycm9yfEZpbGVFcnJvcltdfG51bGx9IFtvcHRpb25zLnZhbGlkYXRvcl1cbiAqIEByZXR1cm5zXG4gKi9cblxuXG5leHBvcnQgZnVuY3Rpb24gYWxsRmlsZXNBY2NlcHRlZChfcmVmKSB7XG4gIHZhciBmaWxlcyA9IF9yZWYuZmlsZXMsXG4gICAgICBhY2NlcHQgPSBfcmVmLmFjY2VwdCxcbiAgICAgIG1pblNpemUgPSBfcmVmLm1pblNpemUsXG4gICAgICBtYXhTaXplID0gX3JlZi5tYXhTaXplLFxuICAgICAgbXVsdGlwbGUgPSBfcmVmLm11bHRpcGxlLFxuICAgICAgbWF4RmlsZXMgPSBfcmVmLm1heEZpbGVzLFxuICAgICAgdmFsaWRhdG9yID0gX3JlZi52YWxpZGF0b3I7XG5cbiAgaWYgKCFtdWx0aXBsZSAmJiBmaWxlcy5sZW5ndGggPiAxIHx8IG11bHRpcGxlICYmIG1heEZpbGVzID49IDEgJiYgZmlsZXMubGVuZ3RoID4gbWF4RmlsZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZmlsZXMuZXZlcnkoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICB2YXIgX2ZpbGVBY2NlcHRlZCA9IGZpbGVBY2NlcHRlZChmaWxlLCBhY2NlcHQpLFxuICAgICAgICBfZmlsZUFjY2VwdGVkMiA9IF9zbGljZWRUb0FycmF5KF9maWxlQWNjZXB0ZWQsIDEpLFxuICAgICAgICBhY2NlcHRlZCA9IF9maWxlQWNjZXB0ZWQyWzBdO1xuXG4gICAgdmFyIF9maWxlTWF0Y2hTaXplID0gZmlsZU1hdGNoU2l6ZShmaWxlLCBtaW5TaXplLCBtYXhTaXplKSxcbiAgICAgICAgX2ZpbGVNYXRjaFNpemUyID0gX3NsaWNlZFRvQXJyYXkoX2ZpbGVNYXRjaFNpemUsIDEpLFxuICAgICAgICBzaXplTWF0Y2ggPSBfZmlsZU1hdGNoU2l6ZTJbMF07XG5cbiAgICB2YXIgY3VzdG9tRXJyb3JzID0gdmFsaWRhdG9yID8gdmFsaWRhdG9yKGZpbGUpIDogbnVsbDtcbiAgICByZXR1cm4gYWNjZXB0ZWQgJiYgc2l6ZU1hdGNoICYmICFjdXN0b21FcnJvcnM7XG4gIH0pO1xufSAvLyBSZWFjdCdzIHN5bnRoZXRpYyBldmVudHMgaGFzIGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkLFxuLy8gYnV0IHRvIHJlbWFpbiBjb21wYXRpYmlsaXR5IHdpdGggb3RoZXIgbGlicyAoUHJlYWN0KSBmYWxsIGJhY2tcbi8vIHRvIGNoZWNrIGV2ZW50LmNhbmNlbEJ1YmJsZVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wYWdhdGlvblN0b3BwZWQoZXZlbnQpIHtcbiAgaWYgKHR5cGVvZiBldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV2ZW50LmNhbmNlbEJ1YmJsZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiBldmVudC5jYW5jZWxCdWJibGU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNFdnRXaXRoRmlsZXMoZXZlbnQpIHtcbiAgaWYgKCFldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICByZXR1cm4gISFldmVudC50YXJnZXQgJiYgISFldmVudC50YXJnZXQuZmlsZXM7XG4gIH0gLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RhdGFUcmFuc2Zlci90eXBlc1xuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTF9EcmFnX2FuZF9Ecm9wX0FQSS9SZWNvbW1lbmRlZF9kcmFnX3R5cGVzI2ZpbGVcblxuXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc29tZS5jYWxsKGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlcywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZSA9PT0gXCJGaWxlc1wiIHx8IHR5cGUgPT09IFwiYXBwbGljYXRpb24veC1tb3otZmlsZVwiO1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0tpbmRGaWxlKGl0ZW0pIHtcbiAgcmV0dXJuIF90eXBlb2YoaXRlbSkgPT09IFwib2JqZWN0XCIgJiYgaXRlbSAhPT0gbnVsbCAmJiBpdGVtLmtpbmQgPT09IFwiZmlsZVwiO1xufSAvLyBhbGxvdyB0aGUgZW50aXJlIGRvY3VtZW50IHRvIGJlIGEgZHJhZyB0YXJnZXRcblxuZXhwb3J0IGZ1bmN0aW9uIG9uRG9jdW1lbnREcmFnT3ZlcihldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBpc0llKHVzZXJBZ2VudCkge1xuICByZXR1cm4gdXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpICE9PSAtMSB8fCB1c2VyQWdlbnQuaW5kZXhPZihcIlRyaWRlbnQvXCIpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gaXNFZGdlKHVzZXJBZ2VudCkge1xuICByZXR1cm4gdXNlckFnZW50LmluZGV4T2YoXCJFZGdlL1wiKSAhPT0gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0llT3JFZGdlKCkge1xuICB2YXIgdXNlckFnZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIGlzSWUodXNlckFnZW50KSB8fCBpc0VkZ2UodXNlckFnZW50KTtcbn1cbi8qKlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIHRvIGNvbXBvc2UgZXZlbnQgaGFuZGxlcnNcbiAqIFRoZXkgYXJlIGV4ZWN1dGVkIGluIG9yZGVyIHVudGlsIG9uZSBvZiB0aGVtIGNhbGxzIGBldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpYC5cbiAqIE5vdGUgdGhhdCB0aGUgY2hlY2sgaXMgZG9uZSBvbiB0aGUgZmlyc3QgaW52b2tlIHRvbyxcbiAqIG1lYW5pbmcgdGhhdCBpZiBwcm9wYWdhdGlvbiB3YXMgc3RvcHBlZCBiZWZvcmUgaW52b2tpbmcgdGhlIGZucyxcbiAqIG5vIGhhbmRsZXJzIHdpbGwgYmUgZXhlY3V0ZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5zIHRoZSBldmVudCBoYW5sZGVyIGZ1bmN0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBldmVudCBoYW5kbGVyIHRvIGFkZCB0byBhbiBlbGVtZW50XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VFdmVudEhhbmRsZXJzKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGZuc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm5zLnNvbWUoZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAoIWlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KSAmJiBmbikge1xuICAgICAgICBmbi5hcHBseSh2b2lkIDAsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KTtcbiAgICB9KTtcbiAgfTtcbn1cbi8qKlxuICogY2FuVXNlRmlsZVN5c3RlbUFjY2Vzc0FQSSBjaGVja3MgaWYgdGhlIFtGaWxlIFN5c3RlbSBBY2Nlc3MgQVBJXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZV9TeXN0ZW1fQWNjZXNzX0FQSSlcbiAqIGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci5cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJKCkge1xuICByZXR1cm4gXCJzaG93T3BlbkZpbGVQaWNrZXJcIiBpbiB3aW5kb3c7XG59XG4vKipcbiAqIENvbnZlcnQgdGhlIGB7YWNjZXB0fWAgZHJvcHpvbmUgcHJvcCB0byB0aGVcbiAqIGB7dHlwZXN9YCBvcHRpb24gZm9yIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cvc2hvd09wZW5GaWxlUGlja2VyXG4gKlxuICogQHBhcmFtIHtBY2NlcHRQcm9wfSBhY2NlcHRcbiAqIEByZXR1cm5zIHt7YWNjZXB0OiBzdHJpbmdbXX1bXX1cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQoYWNjZXB0KSB7XG4gIGlmIChpc0RlZmluZWQoYWNjZXB0KSkge1xuICAgIHZhciBhY2NlcHRGb3JQaWNrZXIgPSBPYmplY3QuZW50cmllcyhhY2NlcHQpLmZpbHRlcihmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciBfcmVmMyA9IF9zbGljZWRUb0FycmF5KF9yZWYyLCAyKSxcbiAgICAgICAgICBtaW1lVHlwZSA9IF9yZWYzWzBdLFxuICAgICAgICAgIGV4dCA9IF9yZWYzWzFdO1xuXG4gICAgICB2YXIgb2sgPSB0cnVlO1xuXG4gICAgICBpZiAoIWlzTUlNRVR5cGUobWltZVR5cGUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlNraXBwZWQgXFxcIlwiLmNvbmNhdChtaW1lVHlwZSwgXCJcXFwiIGJlY2F1c2UgaXQgaXMgbm90IGEgdmFsaWQgTUlNRSB0eXBlLiBDaGVjayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVFRQL0Jhc2ljc19vZl9IVFRQL01JTUVfdHlwZXMvQ29tbW9uX3R5cGVzIGZvciBhIGxpc3Qgb2YgdmFsaWQgTUlNRSB0eXBlcy5cIikpO1xuICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXh0KSB8fCAhZXh0LmV2ZXJ5KGlzRXh0KSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJTa2lwcGVkIFxcXCJcIi5jb25jYXQobWltZVR5cGUsIFwiXFxcIiBiZWNhdXNlIGFuIGludmFsaWQgZmlsZSBleHRlbnNpb24gd2FzIHByb3ZpZGVkLlwiKSk7XG4gICAgICAgIG9rID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvaztcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKGFnZywgX3JlZjQpIHtcbiAgICAgIHZhciBfcmVmNSA9IF9zbGljZWRUb0FycmF5KF9yZWY0LCAyKSxcbiAgICAgICAgICBtaW1lVHlwZSA9IF9yZWY1WzBdLFxuICAgICAgICAgIGV4dCA9IF9yZWY1WzFdO1xuXG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBhZ2cpLCB7fSwgX2RlZmluZVByb3BlcnR5KHt9LCBtaW1lVHlwZSwgZXh0KSk7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBbe1xuICAgICAgLy8gZGVzY3JpcHRpb24gaXMgcmVxdWlyZWQgZHVlIHRvIGh0dHBzOi8vY3JidWcuY29tLzEyNjQ3MDhcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkZpbGVzXCIsXG4gICAgICBhY2NlcHQ6IGFjY2VwdEZvclBpY2tlclxuICAgIH1dO1xuICB9XG5cbiAgcmV0dXJuIGFjY2VwdDtcbn1cbi8qKlxuICogQ29udmVydCB0aGUgYHthY2NlcHR9YCBkcm9wem9uZSBwcm9wIHRvIGFuIGFycmF5IG9mIE1JTUUgdHlwZXMvZXh0ZW5zaW9ucy5cbiAqIEBwYXJhbSB7QWNjZXB0UHJvcH0gYWNjZXB0XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBhY2NlcHRQcm9wQXNBY2NlcHRBdHRyKGFjY2VwdCkge1xuICBpZiAoaXNEZWZpbmVkKGFjY2VwdCkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoYWNjZXB0KS5yZWR1Y2UoZnVuY3Rpb24gKGEsIF9yZWY2KSB7XG4gICAgICB2YXIgX3JlZjcgPSBfc2xpY2VkVG9BcnJheShfcmVmNiwgMiksXG4gICAgICAgICAgbWltZVR5cGUgPSBfcmVmN1swXSxcbiAgICAgICAgICBleHQgPSBfcmVmN1sxXTtcblxuICAgICAgcmV0dXJuIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoYSksIFttaW1lVHlwZV0sIF90b0NvbnN1bWFibGVBcnJheShleHQpKTtcbiAgICB9LCBbXSkgLy8gU2lsZW50bHkgZGlzY2FyZCBpbnZhbGlkIGVudHJpZXMgYXMgcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQgd2FybnMgYWJvdXQgdGhlc2VcbiAgICAuZmlsdGVyKGZ1bmN0aW9uICh2KSB7XG4gICAgICByZXR1cm4gaXNNSU1FVHlwZSh2KSB8fCBpc0V4dCh2KTtcbiAgICB9KS5qb2luKFwiLFwiKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4vKipcbiAqIENoZWNrIGlmIHYgaXMgYW4gZXhjZXB0aW9uIGNhdXNlZCBieSBhYm9ydGluZyBhIHJlcXVlc3QgKGUuZyB3aW5kb3cuc2hvd09wZW5GaWxlUGlja2VyKCkpLlxuICpcbiAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NRXhjZXB0aW9uLlxuICogQHBhcmFtIHthbnl9IHZcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHYgaXMgYW4gYWJvcnQgZXhjZXB0aW9uLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fib3J0KHYpIHtcbiAgcmV0dXJuIHYgaW5zdGFuY2VvZiBET01FeGNlcHRpb24gJiYgKHYubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgfHwgdi5jb2RlID09PSB2LkFCT1JUX0VSUik7XG59XG4vKipcbiAqIENoZWNrIGlmIHYgaXMgYSBzZWN1cml0eSBlcnJvci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTUV4Y2VwdGlvbi5cbiAqIEBwYXJhbSB7YW55fSB2XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2IGlzIGEgc2VjdXJpdHkgZXJyb3IuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2VjdXJpdHlFcnJvcih2KSB7XG4gIHJldHVybiB2IGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uICYmICh2Lm5hbWUgPT09IFwiU2VjdXJpdHlFcnJvclwiIHx8IHYuY29kZSA9PT0gdi5TRUNVUklUWV9FUlIpO1xufVxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGEgTUlNRSB0eXBlIHN0cmluZy5cbiAqXG4gKiBTZWUgYWNjZXB0ZWQgZm9ybWF0OiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvaW5wdXQvZmlsZSN1bmlxdWVfZmlsZV90eXBlX3NwZWNpZmllcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNNSU1FVHlwZSh2KSB7XG4gIHJldHVybiB2ID09PSBcImF1ZGlvLypcIiB8fCB2ID09PSBcInZpZGVvLypcIiB8fCB2ID09PSBcImltYWdlLypcIiB8fCB2ID09PSBcInRleHQvKlwiIHx8IHYgPT09IFwiYXBwbGljYXRpb24vKlwiIHx8IC9cXHcrXFwvWy0rLlxcd10rL2cudGVzdCh2KTtcbn1cbi8qKlxuICogQ2hlY2sgaWYgdiBpcyBhIGZpbGUgZXh0ZW5zaW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHZcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNFeHQodikge1xuICByZXR1cm4gL14uKlxcLltcXHddKyQvLnRlc3Qodik7XG59XG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3QuPHN0cmluZywgc3RyaW5nW10+fSBBY2NlcHRQcm9wXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBGaWxlRXJyb3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXNzYWdlXG4gKiBAcHJvcGVydHkge0Vycm9yQ29kZXxzdHJpbmd9IGNvZGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtcImZpbGUtaW52YWxpZC10eXBlXCJ8XCJmaWxlLXRvby1sYXJnZVwifFwiZmlsZS10b28tc21hbGxcInxcInRvby1tYW55LWZpbGVzXCJ9IEVycm9yQ29kZVxuICovIiwidmFyIF9leGNsdWRlZCA9IFtcImNoaWxkcmVuXCJdLFxuICAgIF9leGNsdWRlZDIgPSBbXCJvcGVuXCJdLFxuICAgIF9leGNsdWRlZDMgPSBbXCJyZWZLZXlcIiwgXCJyb2xlXCIsIFwib25LZXlEb3duXCIsIFwib25Gb2N1c1wiLCBcIm9uQmx1clwiLCBcIm9uQ2xpY2tcIiwgXCJvbkRyYWdFbnRlclwiLCBcIm9uRHJhZ092ZXJcIiwgXCJvbkRyYWdMZWF2ZVwiLCBcIm9uRHJvcFwiXSxcbiAgICBfZXhjbHVkZWQ0ID0gW1wicmVmS2V5XCIsIFwib25DaGFuZ2VcIiwgXCJvbkNsaWNrXCJdO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl07IGlmIChfaSA9PSBudWxsKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX3MsIF9lOyB0cnkgeyBmb3IgKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBlbnVtZXJhYmxlT25seSAmJiAoc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pKSwga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBudWxsICE9IGFyZ3VtZW50c1tpXSA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpICUgMiA/IG93bktleXMoT2JqZWN0KHNvdXJjZSksICEwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7IH0pIDogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpIDogb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCk7IHZhciBrZXksIGk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzb3VyY2VTeW1ib2xLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VTeW1ib2xLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbi8qIGVzbGludCBwcmVmZXItdGVtcGxhdGU6IDAgKi9cbmltcG9ydCBSZWFjdCwgeyBmb3J3YXJkUmVmLCBGcmFnbWVudCwgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlSW1wZXJhdGl2ZUhhbmRsZSwgdXNlTWVtbywgdXNlUmVkdWNlciwgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gXCJwcm9wLXR5cGVzXCI7XG5pbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tIFwiZmlsZS1zZWxlY3RvclwiO1xuaW1wb3J0IHsgYWNjZXB0UHJvcEFzQWNjZXB0QXR0ciwgYWxsRmlsZXNBY2NlcHRlZCwgY29tcG9zZUV2ZW50SGFuZGxlcnMsIGZpbGVBY2NlcHRlZCwgZmlsZU1hdGNoU2l6ZSwgY2FuVXNlRmlsZVN5c3RlbUFjY2Vzc0FQSSwgaXNBYm9ydCwgaXNFdnRXaXRoRmlsZXMsIGlzSWVPckVkZ2UsIGlzUHJvcGFnYXRpb25TdG9wcGVkLCBpc1NlY3VyaXR5RXJyb3IsIG9uRG9jdW1lbnREcmFnT3ZlciwgcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQsIFRPT19NQU5ZX0ZJTEVTX1JFSkVDVElPTiB9IGZyb20gXCIuL3V0aWxzL2luZGV4LmpzXCI7XG4vKipcbiAqIENvbnZlbmllbmNlIHdyYXBwZXIgY29tcG9uZW50IGZvciB0aGUgYHVzZURyb3B6b25lYCBob29rXG4gKlxuICogYGBganN4XG4gKiA8RHJvcHpvbmU+XG4gKiAgIHsoe2dldFJvb3RQcm9wcywgZ2V0SW5wdXRQcm9wc30pID0+IChcbiAqICAgICA8ZGl2IHsuLi5nZXRSb290UHJvcHMoKX0+XG4gKiAgICAgICA8aW5wdXQgey4uLmdldElucHV0UHJvcHMoKX0gLz5cbiAqICAgICAgIDxwPkRyYWcgJ24nIGRyb3Agc29tZSBmaWxlcyBoZXJlLCBvciBjbGljayB0byBzZWxlY3QgZmlsZXM8L3A+XG4gKiAgICAgPC9kaXY+XG4gKiAgICl9XG4gKiA8L0Ryb3B6b25lPlxuICogYGBgXG4gKi9cblxudmFyIERyb3B6b25lID0gLyojX19QVVJFX18qL2ZvcndhcmRSZWYoZnVuY3Rpb24gKF9yZWYsIHJlZikge1xuICB2YXIgY2hpbGRyZW4gPSBfcmVmLmNoaWxkcmVuLFxuICAgICAgcGFyYW1zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIF9leGNsdWRlZCk7XG5cbiAgdmFyIF91c2VEcm9wem9uZSA9IHVzZURyb3B6b25lKHBhcmFtcyksXG4gICAgICBvcGVuID0gX3VzZURyb3B6b25lLm9wZW4sXG4gICAgICBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfdXNlRHJvcHpvbmUsIF9leGNsdWRlZDIpO1xuXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW46IG9wZW5cbiAgICB9O1xuICB9LCBbb3Blbl0pOyAvLyBUT0RPOiBGaWd1cmUgb3V0IHdoeSByZWFjdC1zdHlsZWd1aWRpc3QgY2Fubm90IGNyZWF0ZSBkb2NzIGlmIHdlIGRvbid0IHJldHVybiBhIGpzeCBlbGVtZW50XG5cbiAgcmV0dXJuIC8qI19fUFVSRV9fKi9SZWFjdC5jcmVhdGVFbGVtZW50KEZyYWdtZW50LCBudWxsLCBjaGlsZHJlbihfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHByb3BzKSwge30sIHtcbiAgICBvcGVuOiBvcGVuXG4gIH0pKSk7XG59KTtcbkRyb3B6b25lLmRpc3BsYXlOYW1lID0gXCJEcm9wem9uZVwiOyAvLyBBZGQgZGVmYXVsdCBwcm9wcyBmb3IgcmVhY3QtZG9jZ2VuXG5cbnZhciBkZWZhdWx0UHJvcHMgPSB7XG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgZ2V0RmlsZXNGcm9tRXZlbnQ6IGZyb21FdmVudCxcbiAgbWF4U2l6ZTogSW5maW5pdHksXG4gIG1pblNpemU6IDAsXG4gIG11bHRpcGxlOiB0cnVlLFxuICBtYXhGaWxlczogMCxcbiAgcHJldmVudERyb3BPbkRvY3VtZW50OiB0cnVlLFxuICBub0NsaWNrOiBmYWxzZSxcbiAgbm9LZXlib2FyZDogZmFsc2UsXG4gIG5vRHJhZzogZmFsc2UsXG4gIG5vRHJhZ0V2ZW50c0J1YmJsaW5nOiBmYWxzZSxcbiAgdmFsaWRhdG9yOiBudWxsLFxuICB1c2VGc0FjY2Vzc0FwaTogZmFsc2UsXG4gIGF1dG9Gb2N1czogZmFsc2Vcbn07XG5Ecm9wem9uZS5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5Ecm9wem9uZS5wcm9wVHlwZXMgPSB7XG4gIC8qKlxuICAgKiBSZW5kZXIgZnVuY3Rpb24gdGhhdCBleHBvc2VzIHRoZSBkcm9wem9uZSBzdGF0ZSBhbmQgcHJvcCBnZXR0ZXIgZm5zXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyYW1zLmdldFJvb3RQcm9wcyBSZXR1cm5zIHRoZSBwcm9wcyB5b3Ugc2hvdWxkIGFwcGx5IHRvIHRoZSByb290IGRyb3AgY29udGFpbmVyIHlvdSByZW5kZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyYW1zLmdldElucHV0UHJvcHMgUmV0dXJucyB0aGUgcHJvcHMgeW91IHNob3VsZCBhcHBseSB0byBoaWRkZW4gZmlsZSBpbnB1dCB5b3UgcmVuZGVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcmFtcy5vcGVuIE9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2dcbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNGb2N1c2VkIERyb3B6b25lIGFyZWEgaXMgaW4gZm9jdXNcbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNGaWxlRGlhbG9nQWN0aXZlIEZpbGUgZGlhbG9nIGlzIG9wZW5lZFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0RyYWdBY3RpdmUgQWN0aXZlIGRyYWcgaXMgaW4gcHJvZ3Jlc3NcbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNEcmFnQWNjZXB0IERyYWdnZWQgZmlsZXMgYXJlIGFjY2VwdGVkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRHJhZ1JlamVjdCBUcnVlIG9ubHkgZHVyaW5nIGFuIGFjdGl2ZSBkcmFnIHdoZW4gc29tZSBkcmFnZ2VkIGZpbGVzIHdvdWxkIGJlIHJlamVjdGVkLiBBZnRlciBkcm9wLCB0aGlzIHJlc2V0cyB0byBmYWxzZS4gVXNlIGZpbGVSZWplY3Rpb25zIGZvciBwb3N0LWRyb3AgZXJyb3JzLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0RyYWdHbG9iYWwgRmlsZXMgYXJlIGJlaW5nIGRyYWdnZWQgYW55d2hlcmUgb24gdGhlIGRvY3VtZW50XG4gICAqIEBwYXJhbSB7RmlsZVtdfSBwYXJhbXMuYWNjZXB0ZWRGaWxlcyBBY2NlcHRlZCBmaWxlc1xuICAgKiBAcGFyYW0ge0ZpbGVSZWplY3Rpb25bXX0gcGFyYW1zLmZpbGVSZWplY3Rpb25zIFJlamVjdGVkIGZpbGVzIGFuZCB3aHkgdGhleSB3ZXJlIHJlamVjdGVkLiBUaGlzIHBlcnNpc3RzIGFmdGVyIGRyb3AgYW5kIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHBvc3QtZHJvcCByZWplY3Rpb25zLlxuICAgKi9cbiAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBTZXQgYWNjZXB0ZWQgZmlsZSB0eXBlcy5cbiAgICogQ2hlY2tvdXQgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9zaG93T3BlbkZpbGVQaWNrZXIgdHlwZXMgb3B0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgKiBLZWVwIGluIG1pbmQgdGhhdCBtaW1lIHR5cGUgZGV0ZXJtaW5hdGlvbiBpcyBub3QgcmVsaWFibGUgYWNyb3NzIHBsYXRmb3Jtcy4gQ1NWIGZpbGVzLFxuICAgKiBmb3IgZXhhbXBsZSwgYXJlIHJlcG9ydGVkIGFzIHRleHQvcGxhaW4gdW5kZXIgbWFjT1MgYnV0IGFzIGFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCB1bmRlclxuICAgKiBXaW5kb3dzLiBJbiBzb21lIGNhc2VzIHRoZXJlIG1pZ2h0IG5vdCBiZSBhIG1pbWUgdHlwZSBzZXQgYXQgYWxsIChodHRwczovL2dpdGh1Yi5jb20vcmVhY3QtZHJvcHpvbmUvcmVhY3QtZHJvcHpvbmUvaXNzdWVzLzI3NikuXG4gICAqL1xuICBhY2NlcHQ6IFByb3BUeXBlcy5vYmplY3RPZihQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSksXG5cbiAgLyoqXG4gICAqIEFsbG93IGRyYWcgJ24nIGRyb3AgKG9yIHNlbGVjdGlvbiBmcm9tIHRoZSBmaWxlIGRpYWxvZykgb2YgbXVsdGlwbGUgZmlsZXNcbiAgICovXG4gIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogSWYgZmFsc2UsIGFsbG93IGRyb3BwZWQgaXRlbXMgdG8gdGFrZSBvdmVyIHRoZSBjdXJyZW50IGJyb3dzZXIgd2luZG93XG4gICAqL1xuICBwcmV2ZW50RHJvcE9uRG9jdW1lbnQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBkaXNhYmxlcyBjbGljayB0byBvcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nXG4gICAqL1xuICBub0NsaWNrOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgZGlzYWJsZXMgU1BBQ0UvRU5URVIgdG8gb3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZy5cbiAgICogTm90ZSB0aGF0IGl0IGFsc28gc3RvcHMgdHJhY2tpbmcgdGhlIGZvY3VzIHN0YXRlLlxuICAgKi9cbiAgbm9LZXlib2FyZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGRpc2FibGVzIGRyYWcgJ24nIGRyb3BcbiAgICovXG4gIG5vRHJhZzogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHN0b3BzIGRyYWcgZXZlbnQgcHJvcGFnYXRpb24gdG8gcGFyZW50c1xuICAgKi9cbiAgbm9EcmFnRXZlbnRzQnViYmxpbmc6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBNaW5pbXVtIGZpbGUgc2l6ZSAoaW4gYnl0ZXMpXG4gICAqL1xuICBtaW5TaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgKiBNYXhpbXVtIGZpbGUgc2l6ZSAoaW4gYnl0ZXMpXG4gICAqL1xuICBtYXhTaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgKiBNYXhpbXVtIGFjY2VwdGVkIG51bWJlciBvZiBmaWxlc1xuICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAwIHdoaWNoIG1lYW5zIHRoZXJlIGlzIG5vIGxpbWl0YXRpb24gdG8gaG93IG1hbnkgZmlsZXMgYXJlIGFjY2VwdGVkLlxuICAgKi9cbiAgbWF4RmlsZXM6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAqIEVuYWJsZS9kaXNhYmxlIHRoZSBkcm9wem9uZVxuICAgKi9cbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBVc2UgdGhpcyB0byBwcm92aWRlIGEgY3VzdG9tIGZpbGUgYWdncmVnYXRvclxuICAgKlxuICAgKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnR8QXJyYXk8RmlsZVN5c3RlbUZpbGVIYW5kbGU+KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICAgKi9cbiAgZ2V0RmlsZXNGcm9tRXZlbnQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiBjbG9zaW5nIHRoZSBmaWxlIGRpYWxvZyB3aXRoIG5vIHNlbGVjdGlvblxuICAgKi9cbiAgb25GaWxlRGlhbG9nQ2FuY2VsOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gb3BlbmluZyB0aGUgZmlsZSBkaWFsb2dcbiAgICovXG4gIG9uRmlsZURpYWxvZ09wZW46IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSB0byB1c2UgdGhlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlX1N5c3RlbV9BY2Nlc3NfQVBJXG4gICAqIHRvIG9wZW4gdGhlIGZpbGUgcGlja2VyIGluc3RlYWQgb2YgdXNpbmcgYW4gYDxpbnB1dCB0eXBlPVwiZmlsZVwiPmAgY2xpY2sgZXZlbnQuXG4gICAqL1xuICB1c2VGc0FjY2Vzc0FwaTogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIHRvIGZvY3VzIHRoZSByb290IGVsZW1lbnQgb24gcmVuZGVyXG4gICAqL1xuICBhdXRvRm9jdXM6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyYWdlbnRlcmAgZXZlbnQgb2NjdXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge0RyYWdFdmVudH0gZXZlbnRcbiAgICovXG4gIG9uRHJhZ0VudGVyOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcmFnbGVhdmVgIGV2ZW50IG9jY3Vyc1xuICAgKlxuICAgKiBAcGFyYW0ge0RyYWdFdmVudH0gZXZlbnRcbiAgICovXG4gIG9uRHJhZ0xlYXZlOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcmFnb3ZlcmAgZXZlbnQgb2NjdXJzXG4gICAqXG4gICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudFxuICAgKi9cbiAgb25EcmFnT3ZlcjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJvcGAgZXZlbnQgb2NjdXJzLlxuICAgKiBOb3RlIHRoYXQgdGhpcyBjYWxsYmFjayBpcyBpbnZva2VkIGFmdGVyIHRoZSBgZ2V0RmlsZXNGcm9tRXZlbnRgIGNhbGxiYWNrIGlzIGRvbmUuXG4gICAqXG4gICAqIEZpbGVzIGFyZSBhY2NlcHRlZCBvciByZWplY3RlZCBiYXNlZCBvbiB0aGUgYGFjY2VwdGAsIGBtdWx0aXBsZWAsIGBtaW5TaXplYCBhbmQgYG1heFNpemVgIHByb3BzLlxuICAgKiBgYWNjZXB0YCBtdXN0IGJlIGEgdmFsaWQgW01JTUUgdHlwZV0oaHR0cDovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9tZWRpYS10eXBlcy9tZWRpYS10eXBlcy54aHRtbCkgYWNjb3JkaW5nIHRvIFtpbnB1dCBlbGVtZW50IHNwZWNpZmljYXRpb25dKGh0dHBzOi8vd3d3LnczLm9yZy93aWtpL0hUTUwvRWxlbWVudHMvaW5wdXQvZmlsZSkgb3IgYSB2YWxpZCBmaWxlIGV4dGVuc2lvbi5cbiAgICogSWYgYG11bHRpcGxlYCBpcyBzZXQgdG8gZmFsc2UgYW5kIGFkZGl0aW9uYWwgZmlsZXMgYXJlIGRyb3BwZWQsXG4gICAqIGFsbCBmaWxlcyBiZXNpZGVzIHRoZSBmaXJzdCB3aWxsIGJlIHJlamVjdGVkLlxuICAgKiBBbnkgZmlsZSB3aGljaCBkb2VzIG5vdCBoYXZlIGEgc2l6ZSBpbiB0aGUgW2BtaW5TaXplYCwgYG1heFNpemVgXSByYW5nZSwgd2lsbCBiZSByZWplY3RlZCBhcyB3ZWxsLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGBvbkRyb3BgIGNhbGxiYWNrIHdpbGwgYWx3YXlzIGJlIGludm9rZWQgcmVnYXJkbGVzcyBpZiB0aGUgZHJvcHBlZCBmaWxlcyB3ZXJlIGFjY2VwdGVkIG9yIHJlamVjdGVkLlxuICAgKiBJZiB5b3UnZCBsaWtlIHRvIHJlYWN0IHRvIGEgc3BlY2lmaWMgc2NlbmFyaW8sIHVzZSB0aGUgYG9uRHJvcEFjY2VwdGVkYC9gb25Ecm9wUmVqZWN0ZWRgIHByb3BzLlxuICAgKlxuICAgKiBgb25Ecm9wYCB3aWxsIHByb3ZpZGUgeW91IHdpdGggYW4gYXJyYXkgb2YgW0ZpbGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlKSBvYmplY3RzIHdoaWNoIHlvdSBjYW4gdGhlbiBwcm9jZXNzIGFuZCBzZW5kIHRvIGEgc2VydmVyLlxuICAgKiBGb3IgZXhhbXBsZSwgd2l0aCBbU3VwZXJBZ2VudF0oaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3N1cGVyYWdlbnQpIGFzIGEgaHR0cC9hamF4IGxpYnJhcnk6XG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGZ1bmN0aW9uIG9uRHJvcChhY2NlcHRlZEZpbGVzKSB7XG4gICAqICAgY29uc3QgcmVxID0gcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAgICogICBhY2NlcHRlZEZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAqICAgICByZXEuYXR0YWNoKGZpbGUubmFtZSwgZmlsZSlcbiAgICogICB9KVxuICAgKiAgIHJlcS5lbmQoY2FsbGJhY2spXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZVtdfSBhY2NlcHRlZEZpbGVzXG4gICAqIEBwYXJhbSB7RmlsZVJlamVjdGlvbltdfSBmaWxlUmVqZWN0aW9uc1xuICAgKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gICAqL1xuICBvbkRyb3A6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyb3BgIGV2ZW50IG9jY3Vycy5cbiAgICogTm90ZSB0aGF0IGlmIG5vIGZpbGVzIGFyZSBhY2NlcHRlZCwgdGhpcyBjYWxsYmFjayBpcyBub3QgaW52b2tlZC5cbiAgICpcbiAgICogQHBhcmFtIHtGaWxlW119IGZpbGVzXG4gICAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50XG4gICAqL1xuICBvbkRyb3BBY2NlcHRlZDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJvcGAgZXZlbnQgb2NjdXJzLlxuICAgKiBOb3RlIHRoYXQgaWYgbm8gZmlsZXMgYXJlIHJlamVjdGVkLCB0aGlzIGNhbGxiYWNrIGlzIG5vdCBpbnZva2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge0ZpbGVSZWplY3Rpb25bXX0gZmlsZVJlamVjdGlvbnNcbiAgICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnRcbiAgICovXG4gIG9uRHJvcFJlamVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlcmUncyBzb21lIGVycm9yIGZyb20gYW55IG9mIHRoZSBwcm9taXNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3JcbiAgICovXG4gIG9uRXJyb3I6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbi4gSXQgbXVzdCByZXR1cm4gbnVsbCBpZiB0aGVyZSdzIG5vIGVycm9ycy5cbiAgICogQHBhcmFtIHtGaWxlfSBmaWxlXG4gICAqIEByZXR1cm5zIHtGaWxlRXJyb3J8RmlsZUVycm9yW118bnVsbH1cbiAgICovXG4gIHZhbGlkYXRvcjogUHJvcFR5cGVzLmZ1bmNcbn07XG5leHBvcnQgZGVmYXVsdCBEcm9wem9uZTtcbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJhZ2VudGVyYCxcbiAqIGBkcmFnb3ZlcmAgYW5kIGBkcmFnbGVhdmVgIGV2ZW50cy5cbiAqIEl0IGlzIG5vdCBpbnZva2VkIGlmIHRoZSBpdGVtcyBhcmUgbm90IGZpbGVzIChzdWNoIGFzIGxpbmssIHRleHQsIGV0Yy4pLlxuICpcbiAqIEBjYWxsYmFjayBkcmFnQ2JcbiAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudFxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJvcGAgb3IgaW5wdXQgY2hhbmdlIGV2ZW50LlxuICogSXQgaXMgbm90IGludm9rZWQgaWYgdGhlIGl0ZW1zIGFyZSBub3QgZmlsZXMgKHN1Y2ggYXMgbGluaywgdGV4dCwgZXRjLikuXG4gKlxuICogQGNhbGxiYWNrIGRyb3BDYlxuICogQHBhcmFtIHtGaWxlW119IGFjY2VwdGVkRmlsZXMgTGlzdCBvZiBhY2NlcHRlZCBmaWxlc1xuICogQHBhcmFtIHtGaWxlUmVqZWN0aW9uW119IGZpbGVSZWplY3Rpb25zIExpc3Qgb2YgcmVqZWN0ZWQgZmlsZXMgYW5kIHdoeSB0aGV5IHdlcmUgcmVqZWN0ZWQuIFRoaXMgaXMgdGhlIGF1dGhvcml0YXRpdmUgc291cmNlIGZvciBwb3N0LWRyb3AgZmlsZSByZWplY3Rpb25zLlxuICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJvcGAgb3IgaW5wdXQgY2hhbmdlIGV2ZW50LlxuICogSXQgaXMgbm90IGludm9rZWQgaWYgdGhlIGl0ZW1zIGFyZSBmaWxlcyAoc3VjaCBhcyBsaW5rLCB0ZXh0LCBldGMuKS5cbiAqXG4gKiBAY2FsbGJhY2sgZHJvcEFjY2VwdGVkQ2JcbiAqIEBwYXJhbSB7RmlsZVtdfSBmaWxlcyBMaXN0IG9mIGFjY2VwdGVkIGZpbGVzIHRoYXQgbWVldCB0aGUgZ2l2ZW4gY3JpdGVyaWFcbiAqIChgYWNjZXB0YCwgYG11bHRpcGxlYCwgYG1pblNpemVgLCBgbWF4U2l6ZWApXG4gKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gKi9cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3IgdGhlIGBkcm9wYCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQuXG4gKlxuICogQGNhbGxiYWNrIGRyb3BSZWplY3RlZENiXG4gKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXMgTGlzdCBvZiByZWplY3RlZCBmaWxlcyB0aGF0IGRvIG5vdCBtZWV0IHRoZSBnaXZlbiBjcml0ZXJpYVxuICogKGBhY2NlcHRgLCBgbXVsdGlwbGVgLCBgbWluU2l6ZWAsIGBtYXhTaXplYClcbiAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGFnZ3JlZ2F0ZSBmaWxlcyxcbiAqIGluIGEgYXN5bmNocm9ub3VzIGZhc2hpb24sIGZyb20gZHJhZyBvciBpbnB1dCBjaGFuZ2UgZXZlbnRzLlxuICpcbiAqIEBjYWxsYmFjayBnZXRGaWxlc0Zyb21FdmVudFxuICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50fEFycmF5PEZpbGVTeXN0ZW1GaWxlSGFuZGxlPil9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAqIEByZXR1cm5zIHsoRmlsZVtdfFByb21pc2U8RmlsZVtdPil9XG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3Qgd2l0aCB0aGUgY3VycmVudCBkcm9wem9uZSBzdGF0ZS5cbiAqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBEcm9wem9uZVN0YXRlXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRm9jdXNlZCBEcm9wem9uZSBhcmVhIGlzIGluIGZvY3VzXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRmlsZURpYWxvZ0FjdGl2ZSBGaWxlIGRpYWxvZyBpcyBvcGVuZWRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNEcmFnQWN0aXZlIEFjdGl2ZSBkcmFnIGlzIGluIHByb2dyZXNzXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRHJhZ0FjY2VwdCBEcmFnZ2VkIGZpbGVzIGFyZSBhY2NlcHRlZFxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0RyYWdSZWplY3QgVHJ1ZSBvbmx5IGR1cmluZyBhbiBhY3RpdmUgZHJhZyB3aGVuIHNvbWUgZHJhZ2dlZCBmaWxlcyB3b3VsZCBiZSByZWplY3RlZC4gQWZ0ZXIgZHJvcCwgdGhpcyByZXNldHMgdG8gZmFsc2UuIFVzZSBmaWxlUmVqZWN0aW9ucyBmb3IgcG9zdC1kcm9wIGVycm9ycy5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNEcmFnR2xvYmFsIEZpbGVzIGFyZSBiZWluZyBkcmFnZ2VkIGFueXdoZXJlIG9uIHRoZSBkb2N1bWVudFxuICogQHByb3BlcnR5IHtGaWxlW119IGFjY2VwdGVkRmlsZXMgQWNjZXB0ZWQgZmlsZXNcbiAqIEBwcm9wZXJ0eSB7RmlsZVJlamVjdGlvbltdfSBmaWxlUmVqZWN0aW9ucyBSZWplY3RlZCBmaWxlcyBhbmQgd2h5IHRoZXkgd2VyZSByZWplY3RlZC4gVGhpcyBwZXJzaXN0cyBhZnRlciBkcm9wIGFuZCBpcyB0aGUgc291cmNlIG9mIHRydXRoIGZvciBwb3N0LWRyb3AgcmVqZWN0aW9ucy5cbiAqL1xuXG4vKipcbiAqIEFuIG9iamVjdCB3aXRoIHRoZSBkcm9wem9uZSBtZXRob2RzLlxuICpcbiAqIEB0eXBlZGVmIHtvYmplY3R9IERyb3B6b25lTWV0aG9kc1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZ2V0Um9vdFByb3BzIFJldHVybnMgdGhlIHByb3BzIHlvdSBzaG91bGQgYXBwbHkgdG8gdGhlIHJvb3QgZHJvcCBjb250YWluZXIgeW91IHJlbmRlclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZ2V0SW5wdXRQcm9wcyBSZXR1cm5zIHRoZSBwcm9wcyB5b3Ugc2hvdWxkIGFwcGx5IHRvIGhpZGRlbiBmaWxlIGlucHV0IHlvdSByZW5kZXJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG9wZW4gT3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZ1xuICovXG5cbnZhciBpbml0aWFsU3RhdGUgPSB7XG4gIGlzRm9jdXNlZDogZmFsc2UsXG4gIGlzRmlsZURpYWxvZ0FjdGl2ZTogZmFsc2UsXG4gIGlzRHJhZ0FjdGl2ZTogZmFsc2UsXG4gIGlzRHJhZ0FjY2VwdDogZmFsc2UsXG4gIGlzRHJhZ1JlamVjdDogZmFsc2UsXG4gIGlzRHJhZ0dsb2JhbDogZmFsc2UsXG4gIGFjY2VwdGVkRmlsZXM6IFtdLFxuICBmaWxlUmVqZWN0aW9uczogW11cbn07XG4vKipcbiAqIEEgUmVhY3QgaG9vayB0aGF0IGNyZWF0ZXMgYSBkcmFnICduJyBkcm9wIGFyZWEuXG4gKlxuICogYGBganN4XG4gKiBmdW5jdGlvbiBNeURyb3B6b25lKHByb3BzKSB7XG4gKiAgIGNvbnN0IHtnZXRSb290UHJvcHMsIGdldElucHV0UHJvcHN9ID0gdXNlRHJvcHpvbmUoe1xuICogICAgIG9uRHJvcDogYWNjZXB0ZWRGaWxlcyA9PiB7XG4gKiAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCB0aGUgRmlsZSBvYmplY3RzLCBlLmcuIHVwbG9hZCB0byBzb21lIHNlcnZlclxuICogICAgIH1cbiAqICAgfSk7XG4gKiAgIHJldHVybiAoXG4gKiAgICAgPGRpdiB7Li4uZ2V0Um9vdFByb3BzKCl9PlxuICogICAgICAgPGlucHV0IHsuLi5nZXRJbnB1dFByb3BzKCl9IC8+XG4gKiAgICAgICA8cD5EcmFnIGFuZCBkcm9wIHNvbWUgZmlsZXMgaGVyZSwgb3IgY2xpY2sgdG8gc2VsZWN0IGZpbGVzPC9wPlxuICogICAgIDwvZGl2PlxuICogICApXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAZnVuY3Rpb24gdXNlRHJvcHpvbmVcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7aW1wb3J0KFwiLi91dGlsc1wiKS5BY2NlcHRQcm9wfSBbcHJvcHMuYWNjZXB0XSBTZXQgYWNjZXB0ZWQgZmlsZSB0eXBlcy5cbiAqIENoZWNrb3V0IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cvc2hvd09wZW5GaWxlUGlja2VyIHR5cGVzIG9wdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqIEtlZXAgaW4gbWluZCB0aGF0IG1pbWUgdHlwZSBkZXRlcm1pbmF0aW9uIGlzIG5vdCByZWxpYWJsZSBhY3Jvc3MgcGxhdGZvcm1zLiBDU1YgZmlsZXMsXG4gKiBmb3IgZXhhbXBsZSwgYXJlIHJlcG9ydGVkIGFzIHRleHQvcGxhaW4gdW5kZXIgbWFjT1MgYnV0IGFzIGFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCB1bmRlclxuICogV2luZG93cy4gSW4gc29tZSBjYXNlcyB0aGVyZSBtaWdodCBub3QgYmUgYSBtaW1lIHR5cGUgc2V0IGF0IGFsbCAoaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0LWRyb3B6b25lL3JlYWN0LWRyb3B6b25lL2lzc3Vlcy8yNzYpLlxuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMubXVsdGlwbGU9dHJ1ZV0gQWxsb3cgZHJhZyAnbicgZHJvcCAob3Igc2VsZWN0aW9uIGZyb20gdGhlIGZpbGUgZGlhbG9nKSBvZiBtdWx0aXBsZSBmaWxlc1xuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMucHJldmVudERyb3BPbkRvY3VtZW50PXRydWVdIElmIGZhbHNlLCBhbGxvdyBkcm9wcGVkIGl0ZW1zIHRvIHRha2Ugb3ZlciB0aGUgY3VycmVudCBicm93c2VyIHdpbmRvd1xuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMubm9DbGljaz1mYWxzZV0gSWYgdHJ1ZSwgZGlzYWJsZXMgY2xpY2sgdG8gb3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZ1xuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMubm9LZXlib2FyZD1mYWxzZV0gSWYgdHJ1ZSwgZGlzYWJsZXMgU1BBQ0UvRU5URVIgdG8gb3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZy5cbiAqIE5vdGUgdGhhdCBpdCBhbHNvIHN0b3BzIHRyYWNraW5nIHRoZSBmb2N1cyBzdGF0ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vRHJhZz1mYWxzZV0gSWYgdHJ1ZSwgZGlzYWJsZXMgZHJhZyAnbicgZHJvcFxuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMubm9EcmFnRXZlbnRzQnViYmxpbmc9ZmFsc2VdIElmIHRydWUsIHN0b3BzIGRyYWcgZXZlbnQgcHJvcGFnYXRpb24gdG8gcGFyZW50c1xuICogQHBhcmFtIHtudW1iZXJ9IFtwcm9wcy5taW5TaXplPTBdIE1pbmltdW0gZmlsZSBzaXplIChpbiBieXRlcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJvcHMubWF4U2l6ZT1JbmZpbml0eV0gTWF4aW11bSBmaWxlIHNpemUgKGluIGJ5dGVzKVxuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMuZGlzYWJsZWQ9ZmFsc2VdIEVuYWJsZS9kaXNhYmxlIHRoZSBkcm9wem9uZVxuICogQHBhcmFtIHtnZXRGaWxlc0Zyb21FdmVudH0gW3Byb3BzLmdldEZpbGVzRnJvbUV2ZW50XSBVc2UgdGhpcyB0byBwcm92aWRlIGEgY3VzdG9tIGZpbGUgYWdncmVnYXRvclxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb3BzLm9uRmlsZURpYWxvZ0NhbmNlbF0gQ2IgZm9yIHdoZW4gY2xvc2luZyB0aGUgZmlsZSBkaWFsb2cgd2l0aCBubyBzZWxlY3Rpb25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLnVzZUZzQWNjZXNzQXBpXSBTZXQgdG8gdHJ1ZSB0byB1c2UgdGhlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlX1N5c3RlbV9BY2Nlc3NfQVBJXG4gKiB0byBvcGVuIHRoZSBmaWxlIHBpY2tlciBpbnN0ZWFkIG9mIHVzaW5nIGFuIGA8aW5wdXQgdHlwZT1cImZpbGVcIj5gIGNsaWNrIGV2ZW50LlxuICogQHBhcmFtIHtib29sZWFufSBhdXRvRm9jdXMgU2V0IHRvIHRydWUgdG8gYXV0byBmb2N1cyB0aGUgcm9vdCBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb3BzLm9uRmlsZURpYWxvZ09wZW5dIENiIGZvciB3aGVuIG9wZW5pbmcgdGhlIGZpbGUgZGlhbG9nXG4gKiBAcGFyYW0ge2RyYWdDYn0gW3Byb3BzLm9uRHJhZ0VudGVyXSBDYiBmb3Igd2hlbiB0aGUgYGRyYWdlbnRlcmAgZXZlbnQgb2NjdXJzLlxuICogQHBhcmFtIHtkcmFnQ2J9IFtwcm9wcy5vbkRyYWdMZWF2ZV0gQ2IgZm9yIHdoZW4gdGhlIGBkcmFnbGVhdmVgIGV2ZW50IG9jY3Vyc1xuICogQHBhcmFtIHtkcmFnQ2J9IFtwcm9wcy5vbkRyYWdPdmVyXSBDYiBmb3Igd2hlbiB0aGUgYGRyYWdvdmVyYCBldmVudCBvY2N1cnNcbiAqIEBwYXJhbSB7ZHJvcENifSBbcHJvcHMub25Ecm9wXSBDYiBmb3Igd2hlbiB0aGUgYGRyb3BgIGV2ZW50IG9jY3Vycy5cbiAqIE5vdGUgdGhhdCB0aGlzIGNhbGxiYWNrIGlzIGludm9rZWQgYWZ0ZXIgdGhlIGBnZXRGaWxlc0Zyb21FdmVudGAgY2FsbGJhY2sgaXMgZG9uZS5cbiAqXG4gKiBGaWxlcyBhcmUgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQgYmFzZWQgb24gdGhlIGBhY2NlcHRgLCBgbXVsdGlwbGVgLCBgbWluU2l6ZWAgYW5kIGBtYXhTaXplYCBwcm9wcy5cbiAqIGBhY2NlcHRgIG11c3QgYmUgYW4gb2JqZWN0IHdpdGgga2V5cyBhcyBhIHZhbGlkIFtNSU1FIHR5cGVdKGh0dHA6Ly93d3cuaWFuYS5vcmcvYXNzaWdubWVudHMvbWVkaWEtdHlwZXMvbWVkaWEtdHlwZXMueGh0bWwpIGFjY29yZGluZyB0byBbaW5wdXQgZWxlbWVudCBzcGVjaWZpY2F0aW9uXShodHRwczovL3d3dy53My5vcmcvd2lraS9IVE1ML0VsZW1lbnRzL2lucHV0L2ZpbGUpIGFuZCB0aGUgdmFsdWUgYW4gYXJyYXkgb2YgZmlsZSBleHRlbnNpb25zIChvcHRpb25hbCkuXG4gKiBJZiBgbXVsdGlwbGVgIGlzIHNldCB0byBmYWxzZSBhbmQgYWRkaXRpb25hbCBmaWxlcyBhcmUgZHJvcHBlZCxcbiAqIGFsbCBmaWxlcyBiZXNpZGVzIHRoZSBmaXJzdCB3aWxsIGJlIHJlamVjdGVkLlxuICogQW55IGZpbGUgd2hpY2ggZG9lcyBub3QgaGF2ZSBhIHNpemUgaW4gdGhlIFtgbWluU2l6ZWAsIGBtYXhTaXplYF0gcmFuZ2UsIHdpbGwgYmUgcmVqZWN0ZWQgYXMgd2VsbC5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIGBvbkRyb3BgIGNhbGxiYWNrIHdpbGwgYWx3YXlzIGJlIGludm9rZWQgcmVnYXJkbGVzcyBpZiB0aGUgZHJvcHBlZCBmaWxlcyB3ZXJlIGFjY2VwdGVkIG9yIHJlamVjdGVkLlxuICogSWYgeW91J2QgbGlrZSB0byByZWFjdCB0byBhIHNwZWNpZmljIHNjZW5hcmlvLCB1c2UgdGhlIGBvbkRyb3BBY2NlcHRlZGAvYG9uRHJvcFJlamVjdGVkYCBwcm9wcy5cbiAqXG4gKiBUaGUgc2Vjb25kIHBhcmFtZXRlciAoZmlsZVJlamVjdGlvbnMpIGlzIHRoZSBhdXRob3JpdGF0aXZlIGxpc3Qgb2YgcmVqZWN0ZWQgZmlsZXMgYWZ0ZXIgYSBkcm9wLlxuICogVXNlIHRoaXMgcGFyYW1ldGVyIG9yIHRoZSBmaWxlUmVqZWN0aW9ucyBzdGF0ZSBwcm9wZXJ0eSB0byBoYW5kbGUgcG9zdC1kcm9wIGZpbGUgcmVqZWN0aW9ucyxcbiAqIGFzIGlzRHJhZ1JlamVjdCBvbmx5IGluZGljYXRlcyByZWplY3Rpb24gc3RhdGUgZHVyaW5nIGFjdGl2ZSBkcmFnIG9wZXJhdGlvbnMuXG4gKlxuICogYG9uRHJvcGAgd2lsbCBwcm92aWRlIHlvdSB3aXRoIGFuIGFycmF5IG9mIFtGaWxlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZSkgb2JqZWN0cyB3aGljaCB5b3UgY2FuIHRoZW4gcHJvY2VzcyBhbmQgc2VuZCB0byBhIHNlcnZlci5cbiAqIEZvciBleGFtcGxlLCB3aXRoIFtTdXBlckFnZW50XShodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvc3VwZXJhZ2VudCkgYXMgYSBodHRwL2FqYXggbGlicmFyeTpcbiAqXG4gKiBgYGBqc1xuICogZnVuY3Rpb24gb25Ecm9wKGFjY2VwdGVkRmlsZXMpIHtcbiAqICAgY29uc3QgcmVxID0gcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgYWNjZXB0ZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICogICAgIHJlcS5hdHRhY2goZmlsZS5uYW1lLCBmaWxlKVxuICogICB9KVxuICogICByZXEuZW5kKGNhbGxiYWNrKVxuICogfVxuICogYGBgXG4gKiBAcGFyYW0ge2Ryb3BBY2NlcHRlZENifSBbcHJvcHMub25Ecm9wQWNjZXB0ZWRdXG4gKiBAcGFyYW0ge2Ryb3BSZWplY3RlZENifSBbcHJvcHMub25Ecm9wUmVqZWN0ZWRdXG4gKiBAcGFyYW0geyhlcnJvcjogRXJyb3IpID0+IHZvaWR9IFtwcm9wcy5vbkVycm9yXVxuICpcbiAqIEByZXR1cm5zIHtEcm9wem9uZVN0YXRlICYgRHJvcHpvbmVNZXRob2RzfVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VEcm9wem9uZSgpIHtcbiAgdmFyIHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgX2RlZmF1bHRQcm9wcyRwcm9wcyA9IF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgZGVmYXVsdFByb3BzKSwgcHJvcHMpLFxuICAgICAgYWNjZXB0ID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5hY2NlcHQsXG4gICAgICBkaXNhYmxlZCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMuZGlzYWJsZWQsXG4gICAgICBnZXRGaWxlc0Zyb21FdmVudCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMuZ2V0RmlsZXNGcm9tRXZlbnQsXG4gICAgICBtYXhTaXplID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5tYXhTaXplLFxuICAgICAgbWluU2l6ZSA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubWluU2l6ZSxcbiAgICAgIG11bHRpcGxlID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5tdWx0aXBsZSxcbiAgICAgIG1heEZpbGVzID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5tYXhGaWxlcyxcbiAgICAgIG9uRHJhZ0VudGVyID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkRyYWdFbnRlcixcbiAgICAgIG9uRHJhZ0xlYXZlID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkRyYWdMZWF2ZSxcbiAgICAgIG9uRHJhZ092ZXIgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRHJhZ092ZXIsXG4gICAgICBvbkRyb3AgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRHJvcCxcbiAgICAgIG9uRHJvcEFjY2VwdGVkID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkRyb3BBY2NlcHRlZCxcbiAgICAgIG9uRHJvcFJlamVjdGVkID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkRyb3BSZWplY3RlZCxcbiAgICAgIG9uRmlsZURpYWxvZ0NhbmNlbCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25GaWxlRGlhbG9nQ2FuY2VsLFxuICAgICAgb25GaWxlRGlhbG9nT3BlbiA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25GaWxlRGlhbG9nT3BlbixcbiAgICAgIHVzZUZzQWNjZXNzQXBpID0gX2RlZmF1bHRQcm9wcyRwcm9wcy51c2VGc0FjY2Vzc0FwaSxcbiAgICAgIGF1dG9Gb2N1cyA9IF9kZWZhdWx0UHJvcHMkcHJvcHMuYXV0b0ZvY3VzLFxuICAgICAgcHJldmVudERyb3BPbkRvY3VtZW50ID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5wcmV2ZW50RHJvcE9uRG9jdW1lbnQsXG4gICAgICBub0NsaWNrID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5ub0NsaWNrLFxuICAgICAgbm9LZXlib2FyZCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubm9LZXlib2FyZCxcbiAgICAgIG5vRHJhZyA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubm9EcmFnLFxuICAgICAgbm9EcmFnRXZlbnRzQnViYmxpbmcgPSBfZGVmYXVsdFByb3BzJHByb3BzLm5vRHJhZ0V2ZW50c0J1YmJsaW5nLFxuICAgICAgb25FcnJvciA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25FcnJvcixcbiAgICAgIHZhbGlkYXRvciA9IF9kZWZhdWx0UHJvcHMkcHJvcHMudmFsaWRhdG9yO1xuXG4gIHZhciBhY2NlcHRBdHRyID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFjY2VwdFByb3BBc0FjY2VwdEF0dHIoYWNjZXB0KTtcbiAgfSwgW2FjY2VwdF0pO1xuICB2YXIgcGlja2VyVHlwZXMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQoYWNjZXB0KTtcbiAgfSwgW2FjY2VwdF0pO1xuICB2YXIgb25GaWxlRGlhbG9nT3BlbkNiID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvbkZpbGVEaWFsb2dPcGVuID09PSBcImZ1bmN0aW9uXCIgPyBvbkZpbGVEaWFsb2dPcGVuIDogbm9vcDtcbiAgfSwgW29uRmlsZURpYWxvZ09wZW5dKTtcbiAgdmFyIG9uRmlsZURpYWxvZ0NhbmNlbENiID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvbkZpbGVEaWFsb2dDYW5jZWwgPT09IFwiZnVuY3Rpb25cIiA/IG9uRmlsZURpYWxvZ0NhbmNlbCA6IG5vb3A7XG4gIH0sIFtvbkZpbGVEaWFsb2dDYW5jZWxdKTtcbiAgLyoqXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7UmVhY3QuTXV0YWJsZVJlZk9iamVjdDxIVE1MRWxlbWVudD59XG4gICAqL1xuXG4gIHZhciByb290UmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgaW5wdXRSZWYgPSB1c2VSZWYobnVsbCk7XG5cbiAgdmFyIF91c2VSZWR1Y2VyID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUpLFxuICAgICAgX3VzZVJlZHVjZXIyID0gX3NsaWNlZFRvQXJyYXkoX3VzZVJlZHVjZXIsIDIpLFxuICAgICAgc3RhdGUgPSBfdXNlUmVkdWNlcjJbMF0sXG4gICAgICBkaXNwYXRjaCA9IF91c2VSZWR1Y2VyMlsxXTtcblxuICB2YXIgaXNGb2N1c2VkID0gc3RhdGUuaXNGb2N1c2VkLFxuICAgICAgaXNGaWxlRGlhbG9nQWN0aXZlID0gc3RhdGUuaXNGaWxlRGlhbG9nQWN0aXZlO1xuICB2YXIgZnNBY2Nlc3NBcGlXb3Jrc1JlZiA9IHVzZVJlZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgJiYgdXNlRnNBY2Nlc3NBcGkgJiYgY2FuVXNlRmlsZVN5c3RlbUFjY2Vzc0FQSSgpKTsgLy8gVXBkYXRlIGZpbGUgZGlhbG9nIGFjdGl2ZSBzdGF0ZSB3aGVuIHRoZSB3aW5kb3cgaXMgZm9jdXNlZCBvblxuXG4gIHZhciBvbldpbmRvd0ZvY3VzID0gZnVuY3Rpb24gb25XaW5kb3dGb2N1cygpIHtcbiAgICAvLyBFeGVjdXRlIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGZpbGUgZGlhbG9nIGlzIG9wZW5lZCBpbiB0aGUgYnJvd3NlclxuICAgIGlmICghZnNBY2Nlc3NBcGlXb3Jrc1JlZi5jdXJyZW50ICYmIGlzRmlsZURpYWxvZ0FjdGl2ZSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgdmFyIGZpbGVzID0gaW5wdXRSZWYuY3VycmVudC5maWxlcztcblxuICAgICAgICAgIGlmICghZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgIHR5cGU6IFwiY2xvc2VEaWFsb2dcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBvbkZpbGVEaWFsb2dDYW5jZWxDYigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgMzAwKTtcbiAgICB9XG4gIH07XG5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIG9uV2luZG93Rm9jdXMsIGZhbHNlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBvbldpbmRvd0ZvY3VzLCBmYWxzZSk7XG4gICAgfTtcbiAgfSwgW2lucHV0UmVmLCBpc0ZpbGVEaWFsb2dBY3RpdmUsIG9uRmlsZURpYWxvZ0NhbmNlbENiLCBmc0FjY2Vzc0FwaVdvcmtzUmVmXSk7XG4gIHZhciBkcmFnVGFyZ2V0c1JlZiA9IHVzZVJlZihbXSk7XG4gIHZhciBnbG9iYWxEcmFnVGFyZ2V0c1JlZiA9IHVzZVJlZihbXSk7XG5cbiAgdmFyIG9uRG9jdW1lbnREcm9wID0gZnVuY3Rpb24gb25Eb2N1bWVudERyb3AoZXZlbnQpIHtcbiAgICBpZiAocm9vdFJlZi5jdXJyZW50ICYmIHJvb3RSZWYuY3VycmVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAvLyBJZiB3ZSBpbnRlcmNlcHRlZCBhbiBldmVudCBmb3Igb3VyIGluc3RhbmNlLCBsZXQgaXQgcHJvcGFnYXRlIGRvd24gdG8gdGhlIGluc3RhbmNlJ3Mgb25Ecm9wIGhhbmRsZXJcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXTtcbiAgfTtcblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChwcmV2ZW50RHJvcE9uRG9jdW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBvbkRvY3VtZW50RHJhZ092ZXIsIGZhbHNlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG9uRG9jdW1lbnREcm9wLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChwcmV2ZW50RHJvcE9uRG9jdW1lbnQpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG9uRG9jdW1lbnREcmFnT3Zlcik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG9uRG9jdW1lbnREcm9wKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LCBbcm9vdFJlZiwgcHJldmVudERyb3BPbkRvY3VtZW50XSk7IC8vIFRyYWNrIGdsb2JhbCBkcmFnIHN0YXRlIGZvciBkb2N1bWVudC1sZXZlbCBkcmFnIGV2ZW50c1xuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9uRG9jdW1lbnREcmFnRW50ZXIgPSBmdW5jdGlvbiBvbkRvY3VtZW50RHJhZ0VudGVyKGV2ZW50KSB7XG4gICAgICBnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50KSwgW2V2ZW50LnRhcmdldF0pO1xuXG4gICAgICBpZiAoaXNFdnRXaXRoRmlsZXMoZXZlbnQpKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICBpc0RyYWdHbG9iYWw6IHRydWUsXG4gICAgICAgICAgdHlwZTogXCJzZXREcmFnR2xvYmFsXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbkRvY3VtZW50RHJhZ0xlYXZlID0gZnVuY3Rpb24gb25Eb2N1bWVudERyYWdMZWF2ZShldmVudCkge1xuICAgICAgLy8gT25seSBkZWFjdGl2YXRlIG9uY2Ugd2UndmUgbGVmdCBhbGwgY2hpbGRyZW5cbiAgICAgIGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBnbG9iYWxEcmFnVGFyZ2V0c1JlZi5jdXJyZW50LmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsICE9PSBldmVudC50YXJnZXQgJiYgZWwgIT09IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgaXNEcmFnR2xvYmFsOiBmYWxzZSxcbiAgICAgICAgdHlwZTogXCJzZXREcmFnR2xvYmFsXCJcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgb25Eb2N1bWVudERyYWdFbmQgPSBmdW5jdGlvbiBvbkRvY3VtZW50RHJhZ0VuZCgpIHtcbiAgICAgIGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgaXNEcmFnR2xvYmFsOiBmYWxzZSxcbiAgICAgICAgdHlwZTogXCJzZXREcmFnR2xvYmFsXCJcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgb25Eb2N1bWVudERyb3BHbG9iYWwgPSBmdW5jdGlvbiBvbkRvY3VtZW50RHJvcEdsb2JhbCgpIHtcbiAgICAgIGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgaXNEcmFnR2xvYmFsOiBmYWxzZSxcbiAgICAgICAgdHlwZTogXCJzZXREcmFnR2xvYmFsXCJcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsIG9uRG9jdW1lbnREcmFnRW50ZXIsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIG9uRG9jdW1lbnREcmFnTGVhdmUsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBvbkRvY3VtZW50RHJhZ0VuZCwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIG9uRG9jdW1lbnREcm9wR2xvYmFsLCBmYWxzZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIiwgb25Eb2N1bWVudERyYWdFbnRlcik7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIG9uRG9jdW1lbnREcmFnTGVhdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgb25Eb2N1bWVudERyYWdFbmQpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgb25Eb2N1bWVudERyb3BHbG9iYWwpO1xuICAgIH07XG4gIH0sIFtyb290UmVmXSk7IC8vIEF1dG8gZm9jdXMgdGhlIHJvb3Qgd2hlbiBhdXRvRm9jdXMgaXMgdHJ1ZVxuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFkaXNhYmxlZCAmJiBhdXRvRm9jdXMgJiYgcm9vdFJlZi5jdXJyZW50KSB7XG4gICAgICByb290UmVmLmN1cnJlbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gIH0sIFtyb290UmVmLCBhdXRvRm9jdXMsIGRpc2FibGVkXSk7XG4gIHZhciBvbkVyckNiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAob25FcnJvcikge1xuICAgICAgb25FcnJvcihlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGV0IHRoZSB1c2VyIGtub3cgc29tZXRoaW5nJ3MgZ29uZSB3cm9uZyBpZiB0aGV5IGhhdmVuJ3QgcHJvdmlkZWQgdGhlIG9uRXJyb3IgY2IuXG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfSwgW29uRXJyb3JdKTtcbiAgdmFyIG9uRHJhZ0VudGVyQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQZXJzaXN0IGhlcmUgYmVjYXVzZSB3ZSBuZWVkIHRoZSBldmVudCBsYXRlciBhZnRlciBnZXRGaWxlc0Zyb21FdmVudCgpIGlzIGRvbmVcblxuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICBzdG9wUHJvcGFnYXRpb24oZXZlbnQpO1xuICAgIGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQpLCBbZXZlbnQudGFyZ2V0XSk7XG5cbiAgICBpZiAoaXNFdnRXaXRoRmlsZXMoZXZlbnQpKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoZ2V0RmlsZXNGcm9tRXZlbnQoZXZlbnQpKS50aGVuKGZ1bmN0aW9uIChmaWxlcykge1xuICAgICAgICBpZiAoaXNQcm9wYWdhdGlvblN0b3BwZWQoZXZlbnQpICYmICFub0RyYWdFdmVudHNCdWJibGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlQ291bnQgPSBmaWxlcy5sZW5ndGg7XG4gICAgICAgIHZhciBpc0RyYWdBY2NlcHQgPSBmaWxlQ291bnQgPiAwICYmIGFsbEZpbGVzQWNjZXB0ZWQoe1xuICAgICAgICAgIGZpbGVzOiBmaWxlcyxcbiAgICAgICAgICBhY2NlcHQ6IGFjY2VwdEF0dHIsXG4gICAgICAgICAgbWluU2l6ZTogbWluU2l6ZSxcbiAgICAgICAgICBtYXhTaXplOiBtYXhTaXplLFxuICAgICAgICAgIG11bHRpcGxlOiBtdWx0aXBsZSxcbiAgICAgICAgICBtYXhGaWxlczogbWF4RmlsZXMsXG4gICAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBpc0RyYWdSZWplY3QgPSBmaWxlQ291bnQgPiAwICYmICFpc0RyYWdBY2NlcHQ7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICBpc0RyYWdBY2NlcHQ6IGlzRHJhZ0FjY2VwdCxcbiAgICAgICAgICBpc0RyYWdSZWplY3Q6IGlzRHJhZ1JlamVjdCxcbiAgICAgICAgICBpc0RyYWdBY3RpdmU6IHRydWUsXG4gICAgICAgICAgdHlwZTogXCJzZXREcmFnZ2VkRmlsZXNcIlxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAob25EcmFnRW50ZXIpIHtcbiAgICAgICAgICBvbkRyYWdFbnRlcihldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBvbkVyckNiKGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBbZ2V0RmlsZXNGcm9tRXZlbnQsIG9uRHJhZ0VudGVyLCBvbkVyckNiLCBub0RyYWdFdmVudHNCdWJibGluZywgYWNjZXB0QXR0ciwgbWluU2l6ZSwgbWF4U2l6ZSwgbXVsdGlwbGUsIG1heEZpbGVzLCB2YWxpZGF0b3JdKTtcbiAgdmFyIG9uRHJhZ092ZXJDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHN0b3BQcm9wYWdhdGlvbihldmVudCk7XG4gICAgdmFyIGhhc0ZpbGVzID0gaXNFdnRXaXRoRmlsZXMoZXZlbnQpO1xuXG4gICAgaWYgKGhhc0ZpbGVzICYmIGV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcbiAgICAgIH0gY2F0Y2ggKF91bnVzZWQpIHt9XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVtcHR5ICovXG5cbiAgICB9XG5cbiAgICBpZiAoaGFzRmlsZXMgJiYgb25EcmFnT3Zlcikge1xuICAgICAgb25EcmFnT3ZlcihldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LCBbb25EcmFnT3Zlciwgbm9EcmFnRXZlbnRzQnViYmxpbmddKTtcbiAgdmFyIG9uRHJhZ0xlYXZlQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICBzdG9wUHJvcGFnYXRpb24oZXZlbnQpOyAvLyBPbmx5IGRlYWN0aXZhdGUgb25jZSB0aGUgZHJvcHpvbmUgYW5kIGFsbCBjaGlsZHJlbiBoYXZlIGJlZW4gbGVmdFxuXG4gICAgdmFyIHRhcmdldHMgPSBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50LmZpbHRlcihmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gcm9vdFJlZi5jdXJyZW50ICYmIHJvb3RSZWYuY3VycmVudC5jb250YWlucyh0YXJnZXQpO1xuICAgIH0pOyAvLyBNYWtlIHN1cmUgdG8gcmVtb3ZlIGEgdGFyZ2V0IHByZXNlbnQgbXVsdGlwbGUgdGltZXMgb25seSBvbmNlXG4gICAgLy8gKEZpcmVmb3ggbWF5IGZpcmUgZHJhZ2VudGVyL2RyYWdsZWF2ZSBtdWx0aXBsZSB0aW1lcyBvbiB0aGUgc2FtZSBlbGVtZW50KVxuXG4gICAgdmFyIHRhcmdldElkeCA9IHRhcmdldHMuaW5kZXhPZihldmVudC50YXJnZXQpO1xuXG4gICAgaWYgKHRhcmdldElkeCAhPT0gLTEpIHtcbiAgICAgIHRhcmdldHMuc3BsaWNlKHRhcmdldElkeCwgMSk7XG4gICAgfVxuXG4gICAgZHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IHRhcmdldHM7XG5cbiAgICBpZiAodGFyZ2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJzZXREcmFnZ2VkRmlsZXNcIixcbiAgICAgIGlzRHJhZ0FjdGl2ZTogZmFsc2UsXG4gICAgICBpc0RyYWdBY2NlcHQ6IGZhbHNlLFxuICAgICAgaXNEcmFnUmVqZWN0OiBmYWxzZVxuICAgIH0pO1xuXG4gICAgaWYgKGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSAmJiBvbkRyYWdMZWF2ZSkge1xuICAgICAgb25EcmFnTGVhdmUoZXZlbnQpO1xuICAgIH1cbiAgfSwgW3Jvb3RSZWYsIG9uRHJhZ0xlYXZlLCBub0RyYWdFdmVudHNCdWJibGluZ10pO1xuICB2YXIgc2V0RmlsZXMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZmlsZXMsIGV2ZW50KSB7XG4gICAgdmFyIGFjY2VwdGVkRmlsZXMgPSBbXTtcbiAgICB2YXIgZmlsZVJlamVjdGlvbnMgPSBbXTtcbiAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICB2YXIgX2ZpbGVBY2NlcHRlZCA9IGZpbGVBY2NlcHRlZChmaWxlLCBhY2NlcHRBdHRyKSxcbiAgICAgICAgICBfZmlsZUFjY2VwdGVkMiA9IF9zbGljZWRUb0FycmF5KF9maWxlQWNjZXB0ZWQsIDIpLFxuICAgICAgICAgIGFjY2VwdGVkID0gX2ZpbGVBY2NlcHRlZDJbMF0sXG4gICAgICAgICAgYWNjZXB0RXJyb3IgPSBfZmlsZUFjY2VwdGVkMlsxXTtcblxuICAgICAgdmFyIF9maWxlTWF0Y2hTaXplID0gZmlsZU1hdGNoU2l6ZShmaWxlLCBtaW5TaXplLCBtYXhTaXplKSxcbiAgICAgICAgICBfZmlsZU1hdGNoU2l6ZTIgPSBfc2xpY2VkVG9BcnJheShfZmlsZU1hdGNoU2l6ZSwgMiksXG4gICAgICAgICAgc2l6ZU1hdGNoID0gX2ZpbGVNYXRjaFNpemUyWzBdLFxuICAgICAgICAgIHNpemVFcnJvciA9IF9maWxlTWF0Y2hTaXplMlsxXTtcblxuICAgICAgdmFyIGN1c3RvbUVycm9ycyA9IHZhbGlkYXRvciA/IHZhbGlkYXRvcihmaWxlKSA6IG51bGw7XG5cbiAgICAgIGlmIChhY2NlcHRlZCAmJiBzaXplTWF0Y2ggJiYgIWN1c3RvbUVycm9ycykge1xuICAgICAgICBhY2NlcHRlZEZpbGVzLnB1c2goZmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXJyb3JzID0gW2FjY2VwdEVycm9yLCBzaXplRXJyb3JdO1xuXG4gICAgICAgIGlmIChjdXN0b21FcnJvcnMpIHtcbiAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMuY29uY2F0KGN1c3RvbUVycm9ycyk7XG4gICAgICAgIH1cblxuICAgICAgICBmaWxlUmVqZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgIGVycm9yczogZXJyb3JzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIW11bHRpcGxlICYmIGFjY2VwdGVkRmlsZXMubGVuZ3RoID4gMSB8fCBtdWx0aXBsZSAmJiBtYXhGaWxlcyA+PSAxICYmIGFjY2VwdGVkRmlsZXMubGVuZ3RoID4gbWF4RmlsZXMpIHtcbiAgICAgIC8vIFJlamVjdCBldmVyeXRoaW5nIGFuZCBlbXB0eSBhY2NlcHRlZCBmaWxlc1xuICAgICAgYWNjZXB0ZWRGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGZpbGVSZWplY3Rpb25zLnB1c2goe1xuICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgZXJyb3JzOiBbVE9PX01BTllfRklMRVNfUkVKRUNUSU9OXVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgYWNjZXB0ZWRGaWxlcy5zcGxpY2UoMCk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgYWNjZXB0ZWRGaWxlczogYWNjZXB0ZWRGaWxlcyxcbiAgICAgIGZpbGVSZWplY3Rpb25zOiBmaWxlUmVqZWN0aW9ucyxcbiAgICAgIHR5cGU6IFwic2V0RmlsZXNcIlxuICAgIH0pO1xuXG4gICAgaWYgKG9uRHJvcCkge1xuICAgICAgb25Ecm9wKGFjY2VwdGVkRmlsZXMsIGZpbGVSZWplY3Rpb25zLCBldmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGZpbGVSZWplY3Rpb25zLmxlbmd0aCA+IDAgJiYgb25Ecm9wUmVqZWN0ZWQpIHtcbiAgICAgIG9uRHJvcFJlamVjdGVkKGZpbGVSZWplY3Rpb25zLCBldmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGFjY2VwdGVkRmlsZXMubGVuZ3RoID4gMCAmJiBvbkRyb3BBY2NlcHRlZCkge1xuICAgICAgb25Ecm9wQWNjZXB0ZWQoYWNjZXB0ZWRGaWxlcywgZXZlbnQpO1xuICAgIH1cbiAgfSwgW2Rpc3BhdGNoLCBtdWx0aXBsZSwgYWNjZXB0QXR0ciwgbWluU2l6ZSwgbWF4U2l6ZSwgbWF4RmlsZXMsIG9uRHJvcCwgb25Ecm9wQWNjZXB0ZWQsIG9uRHJvcFJlamVjdGVkLCB2YWxpZGF0b3JdKTtcbiAgdmFyIG9uRHJvcENiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUGVyc2lzdCBoZXJlIGJlY2F1c2Ugd2UgbmVlZCB0aGUgZXZlbnQgbGF0ZXIgYWZ0ZXIgZ2V0RmlsZXNGcm9tRXZlbnQoKSBpcyBkb25lXG5cbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgc3RvcFByb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gW107XG5cbiAgICBpZiAoaXNFdnRXaXRoRmlsZXMoZXZlbnQpKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoZ2V0RmlsZXNGcm9tRXZlbnQoZXZlbnQpKS50aGVuKGZ1bmN0aW9uIChmaWxlcykge1xuICAgICAgICBpZiAoaXNQcm9wYWdhdGlvblN0b3BwZWQoZXZlbnQpICYmICFub0RyYWdFdmVudHNCdWJibGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEZpbGVzKGZpbGVzLCBldmVudCk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gb25FcnJDYihlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFwicmVzZXRcIlxuICAgIH0pO1xuICB9LCBbZ2V0RmlsZXNGcm9tRXZlbnQsIHNldEZpbGVzLCBvbkVyckNiLCBub0RyYWdFdmVudHNCdWJibGluZ10pOyAvLyBGbiBmb3Igb3BlbmluZyB0aGUgZmlsZSBkaWFsb2cgcHJvZ3JhbW1hdGljYWxseVxuXG4gIHZhciBvcGVuRmlsZURpYWxvZyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBObyBwb2ludCB0byB1c2UgRlMgYWNjZXNzIEFQSXMgaWYgY29udGV4dCBpcyBub3Qgc2VjdXJlXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU2VjdXJpdHkvU2VjdXJlX0NvbnRleHRzI2ZlYXR1cmVfZGV0ZWN0aW9uXG4gICAgaWYgKGZzQWNjZXNzQXBpV29ya3NSZWYuY3VycmVudCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcIm9wZW5EaWFsb2dcIlxuICAgICAgfSk7XG4gICAgICBvbkZpbGVEaWFsb2dPcGVuQ2IoKTsgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9zaG93T3BlbkZpbGVQaWNrZXJcblxuICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgIG11bHRpcGxlOiBtdWx0aXBsZSxcbiAgICAgICAgdHlwZXM6IHBpY2tlclR5cGVzXG4gICAgICB9O1xuICAgICAgd2luZG93LnNob3dPcGVuRmlsZVBpY2tlcihvcHRzKS50aGVuKGZ1bmN0aW9uIChoYW5kbGVzKSB7XG4gICAgICAgIHJldHVybiBnZXRGaWxlc0Zyb21FdmVudChoYW5kbGVzKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgIHNldEZpbGVzKGZpbGVzLCBudWxsKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFwiY2xvc2VEaWFsb2dcIlxuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIEFib3J0RXJyb3IgbWVhbnMgdGhlIHVzZXIgY2FuY2VsZWRcbiAgICAgICAgaWYgKGlzQWJvcnQoZSkpIHtcbiAgICAgICAgICBvbkZpbGVEaWFsb2dDYW5jZWxDYihlKTtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBcImNsb3NlRGlhbG9nXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1NlY3VyaXR5RXJyb3IoZSkpIHtcbiAgICAgICAgICBmc0FjY2Vzc0FwaVdvcmtzUmVmLmN1cnJlbnQgPSBmYWxzZTsgLy8gQ09SUywgc28gY2Fubm90IHVzZSB0aGlzIEFQSVxuICAgICAgICAgIC8vIFRyeSB1c2luZyB0aGUgaW5wdXRcblxuICAgICAgICAgIGlmIChpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50LnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIGlucHV0UmVmLmN1cnJlbnQuY2xpY2soKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb25FcnJDYihuZXcgRXJyb3IoXCJDYW5ub3Qgb3BlbiB0aGUgZmlsZSBwaWNrZXIgYmVjYXVzZSB0aGUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVfU3lzdGVtX0FjY2Vzc19BUEkgaXMgbm90IHN1cHBvcnRlZCBhbmQgbm8gPGlucHV0PiB3YXMgcHJvdmlkZWQuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb25FcnJDYihlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogXCJvcGVuRGlhbG9nXCJcbiAgICAgIH0pO1xuICAgICAgb25GaWxlRGlhbG9nT3BlbkNiKCk7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50LnZhbHVlID0gbnVsbDtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQuY2xpY2soKTtcbiAgICB9XG4gIH0sIFtkaXNwYXRjaCwgb25GaWxlRGlhbG9nT3BlbkNiLCBvbkZpbGVEaWFsb2dDYW5jZWxDYiwgdXNlRnNBY2Nlc3NBcGksIHNldEZpbGVzLCBvbkVyckNiLCBwaWNrZXJUeXBlcywgbXVsdGlwbGVdKTsgLy8gQ2IgdG8gb3BlbiB0aGUgZmlsZSBkaWFsb2cgd2hlbiBTUEFDRS9FTlRFUiBvY2N1cnMgb24gdGhlIGRyb3B6b25lXG5cbiAgdmFyIG9uS2V5RG93bkNiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgLy8gSWdub3JlIGtleWJvYXJkIGV2ZW50cyBidWJibGluZyB1cCB0aGUgRE9NIHRyZWVcbiAgICBpZiAoIXJvb3RSZWYuY3VycmVudCB8fCAhcm9vdFJlZi5jdXJyZW50LmlzRXF1YWxOb2RlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSBcIiBcIiB8fCBldmVudC5rZXkgPT09IFwiRW50ZXJcIiB8fCBldmVudC5rZXlDb2RlID09PSAzMiB8fCBldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9wZW5GaWxlRGlhbG9nKCk7XG4gICAgfVxuICB9LCBbcm9vdFJlZiwgb3BlbkZpbGVEaWFsb2ddKTsgLy8gVXBkYXRlIGZvY3VzIHN0YXRlIGZvciB0aGUgZHJvcHpvbmVcblxuICB2YXIgb25Gb2N1c0NiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFwiZm9jdXNcIlxuICAgIH0pO1xuICB9LCBbXSk7XG4gIHZhciBvbkJsdXJDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBcImJsdXJcIlxuICAgIH0pO1xuICB9LCBbXSk7IC8vIENiIHRvIG9wZW4gdGhlIGZpbGUgZGlhbG9nIHdoZW4gY2xpY2sgb2NjdXJzIG9uIHRoZSBkcm9wem9uZVxuXG4gIHZhciBvbkNsaWNrQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG5vQ2xpY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIEluIElFMTEvRWRnZSB0aGUgZmlsZS1icm93c2VyIGRpYWxvZyBpcyBibG9ja2luZywgdGhlcmVmb3JlLCB1c2Ugc2V0VGltZW91dCgpXG4gICAgLy8gdG8gZW5zdXJlIFJlYWN0IGNhbiBoYW5kbGUgc3RhdGUgY2hhbmdlc1xuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0LWRyb3B6b25lL3JlYWN0LWRyb3B6b25lL2lzc3Vlcy80NTBcblxuXG4gICAgaWYgKGlzSWVPckVkZ2UoKSkge1xuICAgICAgc2V0VGltZW91dChvcGVuRmlsZURpYWxvZywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wZW5GaWxlRGlhbG9nKCk7XG4gICAgfVxuICB9LCBbbm9DbGljaywgb3BlbkZpbGVEaWFsb2ddKTtcblxuICB2YXIgY29tcG9zZUhhbmRsZXIgPSBmdW5jdGlvbiBjb21wb3NlSGFuZGxlcihmbikge1xuICAgIHJldHVybiBkaXNhYmxlZCA/IG51bGwgOiBmbjtcbiAgfTtcblxuICB2YXIgY29tcG9zZUtleWJvYXJkSGFuZGxlciA9IGZ1bmN0aW9uIGNvbXBvc2VLZXlib2FyZEhhbmRsZXIoZm4pIHtcbiAgICByZXR1cm4gbm9LZXlib2FyZCA/IG51bGwgOiBjb21wb3NlSGFuZGxlcihmbik7XG4gIH07XG5cbiAgdmFyIGNvbXBvc2VEcmFnSGFuZGxlciA9IGZ1bmN0aW9uIGNvbXBvc2VEcmFnSGFuZGxlcihmbikge1xuICAgIHJldHVybiBub0RyYWcgPyBudWxsIDogY29tcG9zZUhhbmRsZXIoZm4pO1xuICB9O1xuXG4gIHZhciBzdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24oZXZlbnQpIHtcbiAgICBpZiAobm9EcmFnRXZlbnRzQnViYmxpbmcpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2V0Um9vdFByb3BzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfcmVmMiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgICAgX3JlZjIkcmVmS2V5ID0gX3JlZjIucmVmS2V5LFxuICAgICAgICAgIHJlZktleSA9IF9yZWYyJHJlZktleSA9PT0gdm9pZCAwID8gXCJyZWZcIiA6IF9yZWYyJHJlZktleSxcbiAgICAgICAgICByb2xlID0gX3JlZjIucm9sZSxcbiAgICAgICAgICBvbktleURvd24gPSBfcmVmMi5vbktleURvd24sXG4gICAgICAgICAgb25Gb2N1cyA9IF9yZWYyLm9uRm9jdXMsXG4gICAgICAgICAgb25CbHVyID0gX3JlZjIub25CbHVyLFxuICAgICAgICAgIG9uQ2xpY2sgPSBfcmVmMi5vbkNsaWNrLFxuICAgICAgICAgIG9uRHJhZ0VudGVyID0gX3JlZjIub25EcmFnRW50ZXIsXG4gICAgICAgICAgb25EcmFnT3ZlciA9IF9yZWYyLm9uRHJhZ092ZXIsXG4gICAgICAgICAgb25EcmFnTGVhdmUgPSBfcmVmMi5vbkRyYWdMZWF2ZSxcbiAgICAgICAgICBvbkRyb3AgPSBfcmVmMi5vbkRyb3AsXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmMiwgX2V4Y2x1ZGVkMyk7XG5cbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoX2RlZmluZVByb3BlcnR5KHtcbiAgICAgICAgb25LZXlEb3duOiBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgb25LZXlEb3duQ2IpKSxcbiAgICAgICAgb25Gb2N1czogY29tcG9zZUtleWJvYXJkSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkZvY3VzLCBvbkZvY3VzQ2IpKSxcbiAgICAgICAgb25CbHVyOiBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uQmx1ciwgb25CbHVyQ2IpKSxcbiAgICAgICAgb25DbGljazogY29tcG9zZUhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25DbGljaywgb25DbGlja0NiKSksXG4gICAgICAgIG9uRHJhZ0VudGVyOiBjb21wb3NlRHJhZ0hhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25EcmFnRW50ZXIsIG9uRHJhZ0VudGVyQ2IpKSxcbiAgICAgICAgb25EcmFnT3ZlcjogY29tcG9zZURyYWdIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRHJhZ092ZXIsIG9uRHJhZ092ZXJDYikpLFxuICAgICAgICBvbkRyYWdMZWF2ZTogY29tcG9zZURyYWdIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRHJhZ0xlYXZlLCBvbkRyYWdMZWF2ZUNiKSksXG4gICAgICAgIG9uRHJvcDogY29tcG9zZURyYWdIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRHJvcCwgb25Ecm9wQ2IpKSxcbiAgICAgICAgcm9sZTogdHlwZW9mIHJvbGUgPT09IFwic3RyaW5nXCIgJiYgcm9sZSAhPT0gXCJcIiA/IHJvbGUgOiBcInByZXNlbnRhdGlvblwiXG4gICAgICB9LCByZWZLZXksIHJvb3RSZWYpLCAhZGlzYWJsZWQgJiYgIW5vS2V5Ym9hcmQgPyB7XG4gICAgICAgIHRhYkluZGV4OiAwXG4gICAgICB9IDoge30pLCByZXN0KTtcbiAgICB9O1xuICB9LCBbcm9vdFJlZiwgb25LZXlEb3duQ2IsIG9uRm9jdXNDYiwgb25CbHVyQ2IsIG9uQ2xpY2tDYiwgb25EcmFnRW50ZXJDYiwgb25EcmFnT3ZlckNiLCBvbkRyYWdMZWF2ZUNiLCBvbkRyb3BDYiwgbm9LZXlib2FyZCwgbm9EcmFnLCBkaXNhYmxlZF0pO1xuICB2YXIgb25JbnB1dEVsZW1lbnRDbGljayA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9LCBbXSk7XG4gIHZhciBnZXRJbnB1dFByb3BzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfcmVmMyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge30sXG4gICAgICAgICAgX3JlZjMkcmVmS2V5ID0gX3JlZjMucmVmS2V5LFxuICAgICAgICAgIHJlZktleSA9IF9yZWYzJHJlZktleSA9PT0gdm9pZCAwID8gXCJyZWZcIiA6IF9yZWYzJHJlZktleSxcbiAgICAgICAgICBvbkNoYW5nZSA9IF9yZWYzLm9uQ2hhbmdlLFxuICAgICAgICAgIG9uQ2xpY2sgPSBfcmVmMy5vbkNsaWNrLFxuICAgICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZjMsIF9leGNsdWRlZDQpO1xuXG4gICAgICB2YXIgaW5wdXRQcm9wcyA9IF9kZWZpbmVQcm9wZXJ0eSh7XG4gICAgICAgIGFjY2VwdDogYWNjZXB0QXR0cixcbiAgICAgICAgbXVsdGlwbGU6IG11bHRpcGxlLFxuICAgICAgICB0eXBlOiBcImZpbGVcIixcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgY2xpcDogXCJyZWN0KDAsIDAsIDAsIDApXCIsXG4gICAgICAgICAgY2xpcFBhdGg6IFwiaW5zZXQoNTAlKVwiLFxuICAgICAgICAgIGhlaWdodDogXCIxcHhcIixcbiAgICAgICAgICBtYXJnaW46IFwiMCAtMXB4IC0xcHggMFwiLFxuICAgICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICB3aWR0aDogXCIxcHhcIixcbiAgICAgICAgICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiXG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlOiBjb21wb3NlSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkNoYW5nZSwgb25Ecm9wQ2IpKSxcbiAgICAgICAgb25DbGljazogY29tcG9zZUhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25DbGljaywgb25JbnB1dEVsZW1lbnRDbGljaykpLFxuICAgICAgICB0YWJJbmRleDogLTFcbiAgICAgIH0sIHJlZktleSwgaW5wdXRSZWYpO1xuXG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBpbnB1dFByb3BzKSwgcmVzdCk7XG4gICAgfTtcbiAgfSwgW2lucHV0UmVmLCBhY2NlcHQsIG11bHRpcGxlLCBvbkRyb3BDYiwgZGlzYWJsZWRdKTtcbiAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgIGlzRm9jdXNlZDogaXNGb2N1c2VkICYmICFkaXNhYmxlZCxcbiAgICBnZXRSb290UHJvcHM6IGdldFJvb3RQcm9wcyxcbiAgICBnZXRJbnB1dFByb3BzOiBnZXRJbnB1dFByb3BzLFxuICAgIHJvb3RSZWY6IHJvb3RSZWYsXG4gICAgaW5wdXRSZWY6IGlucHV0UmVmLFxuICAgIG9wZW46IGNvbXBvc2VIYW5kbGVyKG9wZW5GaWxlRGlhbG9nKVxuICB9KTtcbn1cbi8qKlxuICogQHBhcmFtIHtEcm9wem9uZVN0YXRlfSBzdGF0ZVxuICogQHBhcmFtIHt7dHlwZTogc3RyaW5nfSAmIERyb3B6b25lU3RhdGV9IGFjdGlvblxuICogQHJldHVybnMge0Ryb3B6b25lU3RhdGV9XG4gKi9cblxuZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFwiZm9jdXNcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgaXNGb2N1c2VkOiB0cnVlXG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJibHVyXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGlzRm9jdXNlZDogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcIm9wZW5EaWFsb2dcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIGluaXRpYWxTdGF0ZSksIHt9LCB7XG4gICAgICAgIGlzRmlsZURpYWxvZ0FjdGl2ZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwiY2xvc2VEaWFsb2dcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgaXNGaWxlRGlhbG9nQWN0aXZlOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwic2V0RHJhZ2dlZEZpbGVzXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGlzRHJhZ0FjdGl2ZTogYWN0aW9uLmlzRHJhZ0FjdGl2ZSxcbiAgICAgICAgaXNEcmFnQWNjZXB0OiBhY3Rpb24uaXNEcmFnQWNjZXB0LFxuICAgICAgICBpc0RyYWdSZWplY3Q6IGFjdGlvbi5pc0RyYWdSZWplY3RcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcInNldEZpbGVzXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGFjY2VwdGVkRmlsZXM6IGFjdGlvbi5hY2NlcHRlZEZpbGVzLFxuICAgICAgICBmaWxlUmVqZWN0aW9uczogYWN0aW9uLmZpbGVSZWplY3Rpb25zLFxuICAgICAgICBpc0RyYWdSZWplY3Q6IGZhbHNlXG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJzZXREcmFnR2xvYmFsXCI6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGlzRHJhZ0dsb2JhbDogYWN0aW9uLmlzRHJhZ0dsb2JhbFxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwicmVzZXRcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKHt9LCBpbml0aWFsU3RhdGUpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZXhwb3J0IHsgRXJyb3JDb2RlIH0gZnJvbSBcIi4vdXRpbHMvaW5kZXguanNcIjsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlRHJvcHpvbmUgfSBmcm9tICdyZWFjdC1kcm9wem9uZSc7XG5pbXBvcnQgeyBCb3gsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IElNQUdFX0FDQ0VQVF9NQVAgfSBmcm9tICcuLi8uLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG50eXBlIEltYWdlVXBsb2FkRHJvcHpvbmVQcm9wcyA9IHtcbiAgbXVsdGlwbGU6IGJvb2xlYW47XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBvbkRyb3BBY2NlcHRlZDogKGZpbGVzOiBGaWxlW10pID0+IHZvaWQ7XG59O1xuXG5leHBvcnQgY29uc3QgSW1hZ2VVcGxvYWREcm9wem9uZTogUmVhY3QuRkM8SW1hZ2VVcGxvYWREcm9wem9uZVByb3BzPiA9ICh7XG4gIG11bHRpcGxlLFxuICBkaXNhYmxlZCxcbiAgb25Ecm9wQWNjZXB0ZWQsXG59KSA9PiB7XG4gIGNvbnN0IHsgZ2V0Um9vdFByb3BzLCBnZXRJbnB1dFByb3BzLCBpc0RyYWdBY3RpdmUgfSA9IHVzZURyb3B6b25lKHtcbiAgICBhY2NlcHQ6IElNQUdFX0FDQ0VQVF9NQVAsXG4gICAgbXVsdGlwbGUsXG4gICAgZGlzYWJsZWQsXG4gICAgb25Ecm9wQWNjZXB0ZWQ6IChhY2NlcHRlZEZpbGVzKSA9PiB2b2lkIG9uRHJvcEFjY2VwdGVkKGFjY2VwdGVkRmlsZXMpLFxuICAgIG5vQ2xpY2s6IGZhbHNlLFxuICAgIG5vS2V5Ym9hcmQ6IGZhbHNlLFxuICB9KTtcblxuICBjb25zdCBoaW50ID0gaXNEcmFnQWN0aXZlXG4gICAgPyAnRHJvcCB0aGUgaW1hZ2VzIGhlcmUuLi4nXG4gICAgOiAnRHJhZyAmIGRyb3AgaW1hZ2VzIGhlcmUsIG9yIGNsaWNrIHRvIHNlbGVjdCc7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICB7Li4uZ2V0Um9vdFByb3BzKCl9XG4gICAgICBwYWRkaW5nPVwiZGVmYXVsdFwiXG4gICAgICBib3JkZXI9XCJkZWZhdWx0XCJcbiAgICAgIGJvcmRlclJhZGl1cz1cImRlZmF1bHRcIlxuICAgICAgYmFja2dyb3VuZENvbG9yPXtpc0RyYWdBY3RpdmUgPyAnZ3JleTIwJyA6ICd3aGl0ZSd9XG4gICAgICBzdHlsZT17e1xuICAgICAgICBjdXJzb3I6IGRpc2FibGVkID8gJ25vdC1hbGxvd2VkJyA6ICdwb2ludGVyJyxcbiAgICAgICAgYm9yZGVyU3R5bGU6ICdkYXNoZWQnLFxuICAgICAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxpbnB1dCB7Li4uZ2V0SW5wdXRQcm9wcygpfSAvPlxuICAgICAgPFRleHQgZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCI+XG4gICAgICAgIHtoaW50fVxuICAgICAgPC9UZXh0PlxuICAgIDwvQm94PlxuICApO1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIExvYWRlciB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgVVBMT0FESU5HX1BSRVZJRVdfU1RZTEUgfSBmcm9tICcuLi8uLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG5cbnR5cGUgSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXBQcm9wcyA9IHtcbiAgcHJldmlld1VybHM6IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IGNvbnN0IEltYWdlVXBsb2FkUHJldmlld1N0cmlwOiBSZWFjdC5GQzxcbiAgSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXBQcm9wc1xuPiA9ICh7IHByZXZpZXdVcmxzIH0pID0+IHtcbiAgaWYgKHByZXZpZXdVcmxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IG10PVwiZGVmYXVsdFwiIGRpc3BsYXk9XCJmbGV4XCIgZmxleFdyYXA9XCJ3cmFwXCIgZ2FwPVwiZGVmYXVsdFwiPlxuICAgICAge3ByZXZpZXdVcmxzLm1hcCgodXJsKSA9PiAoXG4gICAgICAgIDxCb3hcbiAgICAgICAgICBrZXk9e3VybH1cbiAgICAgICAgICBwb3NpdGlvbj1cInJlbGF0aXZlXCJcbiAgICAgICAgICBtYj1cInNtXCJcbiAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgZ2FwPVwiZGVmYXVsdFwiXG4gICAgICAgID5cbiAgICAgICAgICA8aW1nIHNyYz17dXJsfSBhbHQ9XCJcIiBzdHlsZT17VVBMT0FESU5HX1BSRVZJRVdfU1RZTEV9IC8+XG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgcG9zaXRpb249XCJhYnNvbHV0ZVwiXG4gICAgICAgICAgICB0b3A9ezB9XG4gICAgICAgICAgICBsZWZ0PXswfVxuICAgICAgICAgICAgcmlnaHQ9ezB9XG4gICAgICAgICAgICBib3R0b209ezB9XG4gICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcj1cInJnYmEoMjU1LDI1NSwyNTUsMC43KVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPExvYWRlciAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICA8L0JveD5cbiAgICAgICkpfVxuICAgIDwvQm94PlxuICApO1xufTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBUZXh0LCBMb2FkZXIgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IFRIVU1CX1NJWkUgfSBmcm9tICcuLi8uLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG5cbnR5cGUgSW1hZ2VVcGxvYWRUaHVtYm5haWxQcm9wcyA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHZhcmlhbnQ6ICdlZGl0JyB8ICdzaG93JztcbiAgaW5kZXg6IG51bWJlcjtcbiAgb25SZW1vdmU/OiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZDtcbn07XG5cbmNvbnN0IENBUkRfU1RZTEUgPSB7XG4gIHdpZHRoOiBUSFVNQl9TSVpFLFxuICBvdmVyZmxvdzogJ2hpZGRlbicgYXMgY29uc3QsXG4gIGJvcmRlclJhZGl1czogOCxcbiAgYm9yZGVyOiAnMXB4IHNvbGlkICNlMGUwZTAnLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1Jyxcbn07XG5cbmNvbnN0IElNR19DT05UQUlORVJfU1RZTEUgPSB7XG4gIHdpZHRoOiBUSFVNQl9TSVpFLFxuICBoZWlnaHQ6IFRIVU1CX1NJWkUsXG4gIGRpc3BsYXk6ICdibG9jaycsXG59O1xuXG5jb25zdCBJTUdfU1RZTEUgPSB7XG4gIHdpZHRoOiBUSFVNQl9TSVpFLFxuICBoZWlnaHQ6IFRIVU1CX1NJWkUsXG4gIG9iamVjdEZpdDogJ2NvdmVyJyBhcyBjb25zdCxcbiAgZGlzcGxheTogJ2Jsb2NrJyxcbn07XG5cbnR5cGUgVGh1bWJuYWlsT3ZlcmxheVN0YXR1cyA9ICdsb2FkaW5nJyB8ICdsb2FkZWQnIHwgJ2Vycm9yJztcblxuZnVuY3Rpb24gVGh1bWJuYWlsT3ZlcmxheSh7IHN0YXR1cyB9OiB7IHN0YXR1czogVGh1bWJuYWlsT3ZlcmxheVN0YXR1cyB9KSB7XG4gIGlmIChzdGF0dXMgPT09ICdsb2FkZWQnKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBwb3NpdGlvbj1cImFic29sdXRlXCJcbiAgICAgIHRvcD17MH1cbiAgICAgIGxlZnQ9ezB9XG4gICAgICByaWdodD17MH1cbiAgICAgIGJvdHRvbT17MH1cbiAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIlxuICAgICAgcGFkZGluZz1cImRlZmF1bHRcIlxuICAgICAgYmFja2dyb3VuZENvbG9yPVwiZ3JleTIwXCJcbiAgICA+XG4gICAgICB7c3RhdHVzID09PSAnbG9hZGluZycgJiYgPExvYWRlciAvPn1cbiAgICAgIHtzdGF0dXMgPT09ICdlcnJvcicgJiYgKFxuICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJlcnJvclwiPlxuICAgICAgICAgIEZhaWxlZCB0byBsb2FkXG4gICAgICAgIDwvVGV4dD5cbiAgICAgICl9XG4gICAgPC9Cb3g+XG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBJbWFnZVVwbG9hZFRodW1ibmFpbDogUmVhY3QuRkM8SW1hZ2VVcGxvYWRUaHVtYm5haWxQcm9wcz4gPSAoe1xuICB1cmwsXG4gIHZhcmlhbnQsXG4gIGluZGV4LFxuICBvblJlbW92ZSxcbn0pID0+IHtcbiAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlPFRodW1ibmFpbE92ZXJsYXlTdGF0dXM+KCdsb2FkaW5nJyk7XG5cbiAgY29uc3QgaW1nID0gKFxuICAgIDxpbWdcbiAgICAgIHNyYz17dXJsfVxuICAgICAgYWx0PVwiXCJcbiAgICAgIHN0eWxlPXtJTUdfU1RZTEV9XG4gICAgICBvbkxvYWQ9eygpID0+IHNldFN0YXR1cygnbG9hZGVkJyl9XG4gICAgICBvbkVycm9yPXsoKSA9PiBzZXRTdGF0dXMoJ2Vycm9yJyl9XG4gICAgLz5cbiAgKTtcblxuICBjb25zdCBpbWFnZUxpbmsgPSAoXG4gICAgPGFcbiAgICAgIGhyZWY9e3VybH1cbiAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGxpbmVIZWlnaHQ6IDAgfX1cbiAgICA+XG4gICAgICB7aW1nfVxuICAgIDwvYT5cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggc3R5bGU9e0NBUkRfU1RZTEV9PlxuICAgICAgPEJveCBwb3NpdGlvbj1cInJlbGF0aXZlXCIgc3R5bGU9e0lNR19DT05UQUlORVJfU1RZTEV9PlxuICAgICAgICB7aW1hZ2VMaW5rfVxuICAgICAgICA8VGh1bWJuYWlsT3ZlcmxheSBzdGF0dXM9e3N0YXR1c30gLz5cbiAgICAgIDwvQm94PlxuICAgICAge3ZhcmlhbnQgPT09ICdlZGl0JyAmJiBvblJlbW92ZSAmJiAoXG4gICAgICAgIDxCb3ggcGFkZGluZz1cInNtXCI+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJkYW5nZXJcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25SZW1vdmUoaW5kZXgpfVxuICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFJlbW92ZVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgRm9ybUdyb3VwLCBMYWJlbCwgVGV4dCwgTG9hZGVyIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQge1xuICBMQUJFTFMsXG4gIFRIVU1CX0dSSURfU1RZTEUsXG59IGZyb20gJy4uLy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgSW1hZ2VVcGxvYWRGaWVsZFN0YXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW1hZ2UtdXBsb2FkLWZpZWxkLnR5cGVzJztcbmltcG9ydCB7IHVzZU9iamVjdFVybHMgfSBmcm9tICcuLi8uLi9ob29rcy91c2VPYmplY3RVcmxzJztcbmltcG9ydCB7IEltYWdlVXBsb2FkRHJvcHpvbmUgfSBmcm9tICcuL0ltYWdlVXBsb2FkRHJvcHpvbmUnO1xuaW1wb3J0IHsgSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAgfSBmcm9tICcuL0ltYWdlVXBsb2FkUHJldmlld1N0cmlwJztcbmltcG9ydCB7IEltYWdlVXBsb2FkVGh1bWJuYWlsIH0gZnJvbSAnLi9JbWFnZVVwbG9hZFRodW1ibmFpbCc7XG5cbnR5cGUgSW1hZ2VVcGxvYWRGaWVsZEVkaXRQcm9wcyA9IEltYWdlVXBsb2FkRmllbGRTdGF0ZTtcblxuZXhwb3J0IGNvbnN0IEltYWdlVXBsb2FkRmllbGRFZGl0OiBSZWFjdC5GQzxJbWFnZVVwbG9hZEZpZWxkRWRpdFByb3BzPiA9ICh7XG4gIGZpZWxkLFxuICBzdGF0dXMsXG4gIGFjdGlvbnMsXG59KSA9PiB7XG4gIGNvbnN0IHByZXZpZXdVcmxzID0gdXNlT2JqZWN0VXJscyhmaWVsZC51cGxvYWRpbmdGaWxlcyk7XG4gIGNvbnN0IGxhYmVsID0gZmllbGQuaXNNdWx0aXBsZSA/IExBQkVMUy5waG90b3MgOiBMQUJFTFMubWFpblBob3RvO1xuICBjb25zdCBkcm9wem9uZURpc2FibGVkID0gc3RhdHVzLnVwbG9hZGluZyB8fCAhZmllbGQudXBsb2FkUGF0aDtcblxuICByZXR1cm4gKFxuICAgIDxCb3g+XG4gICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICA8TGFiZWw+e2xhYmVsfTwvTGFiZWw+XG4gICAgICAgIHtmaWVsZC51cGxvYWRQYXRoUHJlZml4ICYmICFmaWVsZC5yZWNvcmRJZCAmJiAoXG4gICAgICAgICAgPFRleHQgZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbWI9XCJzbVwiPlxuICAgICAgICAgICAge2ZpZWxkLnNhdmVGaXJzdE1lc3NhZ2V9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICApfVxuICAgICAgICA8SW1hZ2VVcGxvYWREcm9wem9uZVxuICAgICAgICAgIG11bHRpcGxlPXtmaWVsZC5pc011bHRpcGxlfVxuICAgICAgICAgIGRpc2FibGVkPXtkcm9wem9uZURpc2FibGVkfVxuICAgICAgICAgIG9uRHJvcEFjY2VwdGVkPXsoZmlsZXMpID0+IHZvaWQgYWN0aW9ucy5oYW5kbGVGaWxlcyhmaWxlcyl9XG4gICAgICAgIC8+XG4gICAgICAgIHtzdGF0dXMudXBsb2FkaW5nICYmIDxMb2FkZXIgLz59XG4gICAgICAgIHtzdGF0dXMuZXJyb3IgJiYgPFRleHQgY29sb3I9XCJlcnJvclwiPntzdGF0dXMuZXJyb3J9PC9UZXh0Pn1cbiAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICA8SW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAgcHJldmlld1VybHM9e3ByZXZpZXdVcmxzfSAvPlxuXG4gICAgICB7ZmllbGQudXJscy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEJveCBtdD1cImRlZmF1bHRcIiBzdHlsZT17VEhVTUJfR1JJRF9TVFlMRX0+XG4gICAgICAgICAge2ZpZWxkLnVybHMubWFwKCh1cmwsIGkpID0+IChcbiAgICAgICAgICAgIDxJbWFnZVVwbG9hZFRodW1ibmFpbFxuICAgICAgICAgICAgICBrZXk9e3VybH1cbiAgICAgICAgICAgICAgdXJsPXt1cmx9XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJlZGl0XCJcbiAgICAgICAgICAgICAgaW5kZXg9e2l9XG4gICAgICAgICAgICAgIG9uUmVtb3ZlPXthY3Rpb25zLnJlbW92ZVVybH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBUSFVNQl9HUklEX1NUWUxFIH0gZnJvbSAnLi4vLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xuaW1wb3J0IHsgSW1hZ2VVcGxvYWRUaHVtYm5haWwgfSBmcm9tICcuL0ltYWdlVXBsb2FkVGh1bWJuYWlsJztcblxudHlwZSBJbWFnZVVwbG9hZEZpZWxkU2hvd1Byb3BzID0ge1xuICB1cmxzOiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBJbWFnZVVwbG9hZEZpZWxkU2hvdzogUmVhY3QuRkM8SW1hZ2VVcGxvYWRGaWVsZFNob3dQcm9wcz4gPSAoe1xuICB1cmxzLFxufSkgPT4ge1xuICBpZiAodXJscy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBzdHlsZT17VEhVTUJfR1JJRF9TVFlMRX0+XG4gICAgICB7dXJscy5tYXAoKHVybCwgaSkgPT4gKFxuICAgICAgICA8SW1hZ2VVcGxvYWRUaHVtYm5haWwga2V5PXt1cmx9IHVybD17dXJsfSB2YXJpYW50PVwic2hvd1wiIGluZGV4PXtpfSAvPlxuICAgICAgKSl9XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUltYWdlVXBsb2FkRmllbGQgfSBmcm9tICcuLi8uLi9ob29rcy91c2VJbWFnZVVwbG9hZEZpZWxkJztcbmltcG9ydCB0eXBlIHsgSW1hZ2VVcGxvYWRGaWVsZFByb3BzIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW1hZ2UtdXBsb2FkLWZpZWxkLnR5cGVzJztcbmltcG9ydCB7IEltYWdlVXBsb2FkRmllbGRFZGl0IH0gZnJvbSAnLi9JbWFnZVVwbG9hZEZpZWxkRWRpdCc7XG5pbXBvcnQgeyBJbWFnZVVwbG9hZEZpZWxkU2hvdyB9IGZyb20gJy4vSW1hZ2VVcGxvYWRGaWVsZFNob3cnO1xuXG5leHBvcnQgY29uc3QgSW1hZ2VVcGxvYWRGaWVsZDogUmVhY3QuRkM8SW1hZ2VVcGxvYWRGaWVsZFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHdoZXJlIH0gPSBwcm9wcztcbiAgY29uc3Qgc3RhdGUgPSB1c2VJbWFnZVVwbG9hZEZpZWxkKHByb3BzKTtcblxuICBpZiAod2hlcmUgPT09ICdlZGl0Jykge1xuICAgIHJldHVybiA8SW1hZ2VVcGxvYWRGaWVsZEVkaXQgey4uLnN0YXRlfSAvPjtcbiAgfVxuXG4gIGlmICh3aGVyZSA9PT0gJ3Nob3cnIHx8IHdoZXJlID09PSAnbGlzdCcpIHtcbiAgICByZXR1cm4gPEltYWdlVXBsb2FkRmllbGRTaG93IHVybHM9e3N0YXRlLmZpZWxkLnVybHN9IC8+O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBJbWFnZVVwbG9hZEZpZWxkO1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgTGlua3NGaWVsZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9MaW5rc0ZpZWxkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5MaW5rc0ZpZWxkID0gTGlua3NGaWVsZFxuaW1wb3J0IEFkZHJlc3NGaWVsZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9BZGRyZXNzRmllbGQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkFkZHJlc3NGaWVsZCA9IEFkZHJlc3NGaWVsZFxuaW1wb3J0IEltYWdlVXBsb2FkRmllbGQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWRGaWVsZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuSW1hZ2VVcGxvYWRGaWVsZCA9IEltYWdlVXBsb2FkRmllbGQiXSwibmFtZXMiOlsiTElOS19LRVlTIiwiTEFCRUxTIiwiZmFjZWJvb2siLCJpbnN0YWdyYW0iLCJhaXJibmIiLCJib29raW5nIiwicGFyc2VMaW5rcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5Iiwib2JqIiwicmVkdWNlIiwiYWNjIiwia2V5IiwidiIsInBhcnNlZCIsIkpTT04iLCJwYXJzZSIsImdldExpbmtzRnJvbVBhcmFtcyIsInBhcmFtcyIsInBhdGgiLCJuZXN0ZWQiLCJwcmVmaXgiLCJ1c2VMaW5rc0ZpZWxkIiwicHJvcHMiLCJwcm9wZXJ0eSIsInJlY29yZCIsIm9uQ2hhbmdlIiwibGlua3MiLCJoYW5kbGVDaGFuZ2UiLCJMaW5rSXRlbUVkaXQiLCJsaW5rS2V5IiwiaWQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGb3JtR3JvdXAiLCJtYiIsIkxhYmVsIiwiaHRtbEZvciIsIklucHV0IiwiZSIsInRhcmdldCIsInBsYWNlaG9sZGVyIiwiTGlua0l0ZW1TaG93IiwiQm94IiwibXQiLCJocmVmIiwicmVsIiwiTGlua3NGaWVsZCIsIndoZXJlIiwibWFwIiwiZmlsbGVkIiwiZmlsdGVyIiwiayIsImxlbmd0aCIsIkRFRkFVTFRfQUREUkVTUyIsImxhYmVsIiwidXJsIiwicGFyc2VBZGRyZXNzIiwiZ2V0QWRkcmVzc0Zyb21QYXJhbXMiLCJ1c2VBZGRyZXNzRmllbGQiLCJhZGRyZXNzIiwiZmllbGQiLCJBZGRyZXNzRmllbGQiLCJoYXNWYWx1ZSIsIkJVQ0tFVCIsIm1haW5QaG90byIsInBob3RvcyIsIlVQTE9BRF9VUkwiLCJERUZBVUxUX1NBVkVfRklSU1RfTUVTU0FHRSIsIlVQTE9BRF9FUlJPUl9GQUxMQkFDSyIsIklNQUdFX0FDQ0VQVF9NQVAiLCJUSFVNQl9TSVpFIiwiVEhVTUJfR1JJRF9TVFlMRSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiVVBMT0FESU5HX1BSRVZJRVdfU1RZTEUiLCJtYXhIZWlnaHQiLCJvYmplY3RGaXQiLCJnZXRVcmxzRnJvbVBhcmFtcyIsImlzTXVsdGlwbGUiLCJnZXRBcnJheUZyb21QYXJhbXMiLCJnZXRSZWNvcmRJZCIsInVuZGVmaW5lZCIsImVuc3VyZVN0cmluZ0FycmF5IiwiZGlyZWN0IiwiY29sbGVjdGVkIiwiaSIsInB1c2giLCJidWlsZFVwbG9hZFBhdGgiLCJ1cGxvYWRQYXRoUHJlZml4IiwicmVjb3JkSWQiLCJzZWdtZW50IiwidHJpbSIsInJlcGxhY2UiLCJnZXRFcnJvck1lc3NhZ2UiLCJlcnIiLCJmYWxsYmFjayIsIkVycm9yIiwibWVzc2FnZSIsInVwbG9hZEZpbGUiLCJmaWxlIiwidXBsb2FkUGF0aCIsIlVSTCIsIndpbmRvdyIsImxvY2F0aW9uIiwib3JpZ2luIiwic2VhcmNoUGFyYW1zIiwic2V0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsInJlcyIsImZldGNoIiwidG9TdHJpbmciLCJtZXRob2QiLCJib2R5IiwiY3JlZGVudGlhbHMiLCJvayIsImpzb24iLCJjYXRjaCIsInN0YXR1c1RleHQiLCJkYXRhIiwiZ2V0U3RvcmFnZUtleUZyb21QdWJsaWNVcmwiLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJzbGljZSIsImRlbGV0ZUZpbGVCeVVybCIsImRlbGV0ZVVybCIsInVwbG9hZEZpbGVzQW5kQnVpbGROZXh0VmFsdWUiLCJmaWxlcyIsImN1cnJlbnRVcmxzIiwibGlzdCIsImZyb20iLCJ1cmxzIiwiZ2V0RmllbGRDb25maWciLCJjdXN0b20iLCJzYXZlRmlyc3RNZXNzYWdlIiwidXNlSW1hZ2VVcGxvYWRGaWVsZCIsImNvbmZpZyIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsInVzZVN0YXRlIiwiZXJyb3IiLCJzZXRFcnJvciIsInVwbG9hZGluZ0ZpbGVzIiwic2V0VXBsb2FkaW5nRmlsZXMiLCJoYW5kbGVGaWxlcyIsIm5leHRWYWx1ZSIsInJlbW92ZVVybCIsImluZGV4IiwidXJsVG9SZW1vdmUiLCJuZXh0IiwiXyIsInN0YXR1cyIsImFjdGlvbnMiLCJ1c2VPYmplY3RVcmxzIiwic2V0VXJscyIsInVzZUVmZmVjdCIsImYiLCJjcmVhdGVPYmplY3RVUkwiLCJmb3JFYWNoIiwicmV2b2tlT2JqZWN0VVJMIiwiZXhwb3J0cyIsInRoaXMiLCJyZXF1aXJlJCQwIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiX2FycmF5V2l0aG91dEhvbGVzIiwiX2l0ZXJhYmxlVG9BcnJheSIsIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsIl9ub25JdGVyYWJsZVNwcmVhZCIsIl9hcnJheUxpa2VUb0FycmF5Iiwib3duS2V5cyIsIl9vYmplY3RTcHJlYWQiLCJfZGVmaW5lUHJvcGVydHkiLCJfc2xpY2VkVG9BcnJheSIsIl9hcnJheVdpdGhIb2xlcyIsIl9pdGVyYWJsZVRvQXJyYXlMaW1pdCIsIl9ub25JdGVyYWJsZVJlc3QiLCJmb3J3YXJkUmVmIiwidXNlSW1wZXJhdGl2ZUhhbmRsZSIsIkZyYWdtZW50IiwiZnJvbUV2ZW50IiwiUHJvcFR5cGVzIiwidXNlTWVtbyIsInVzZVJlZiIsInVzZVJlZHVjZXIiLCJ1c2VDYWxsYmFjayIsIkltYWdlVXBsb2FkRHJvcHpvbmUiLCJtdWx0aXBsZSIsImRpc2FibGVkIiwib25Ecm9wQWNjZXB0ZWQiLCJnZXRSb290UHJvcHMiLCJnZXRJbnB1dFByb3BzIiwiaXNEcmFnQWN0aXZlIiwidXNlRHJvcHpvbmUiLCJhY2NlcHQiLCJhY2NlcHRlZEZpbGVzIiwibm9DbGljayIsIm5vS2V5Ym9hcmQiLCJoaW50IiwiX2V4dGVuZHMiLCJwYWRkaW5nIiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwic3R5bGUiLCJjdXJzb3IiLCJib3JkZXJTdHlsZSIsIm1hcmdpbkJvdHRvbSIsIlRleHQiLCJmb250U2l6ZSIsImNvbG9yIiwiSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAiLCJwcmV2aWV3VXJscyIsImZsZXhXcmFwIiwicG9zaXRpb24iLCJhbGlnbkl0ZW1zIiwic3JjIiwiYWx0IiwidG9wIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwianVzdGlmeUNvbnRlbnQiLCJMb2FkZXIiLCJDQVJEX1NUWUxFIiwid2lkdGgiLCJvdmVyZmxvdyIsIklNR19DT05UQUlORVJfU1RZTEUiLCJoZWlnaHQiLCJJTUdfU1RZTEUiLCJUaHVtYm5haWxPdmVybGF5IiwiSW1hZ2VVcGxvYWRUaHVtYm5haWwiLCJ2YXJpYW50Iiwib25SZW1vdmUiLCJzZXRTdGF0dXMiLCJpbWciLCJvbkxvYWQiLCJvbkVycm9yIiwiaW1hZ2VMaW5rIiwibGluZUhlaWdodCIsIkJ1dHRvbiIsInNpemUiLCJvbkNsaWNrIiwiSW1hZ2VVcGxvYWRGaWVsZEVkaXQiLCJkcm9wem9uZURpc2FibGVkIiwiSW1hZ2VVcGxvYWRGaWVsZFNob3ciLCJJbWFnZVVwbG9hZEZpZWxkIiwic3RhdGUiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0VBQU8sTUFBTUEsU0FBUyxHQUFHLENBQ3ZCLFVBQVUsRUFDVixXQUFXLEVBQ1gsUUFBUSxFQUNSLFNBQVMsQ0FDRDs7RUNGSCxNQUFNQyxRQUErQixHQUFHO0VBQzdDQyxFQUFBQSxRQUFRLEVBQUUsVUFBVTtFQUNwQkMsRUFBQUEsU0FBUyxFQUFFLFdBQVc7RUFDdEJDLEVBQUFBLE1BQU0sRUFBRSxRQUFRO0VBQ2hCQyxFQUFBQSxPQUFPLEVBQUU7RUFDWCxDQUFDO0VBRU0sU0FBU0MsVUFBVUEsQ0FBQ0MsS0FBYyxFQUFjO0VBQ3JELEVBQUEsSUFBSUEsS0FBSyxJQUFJLElBQUksRUFBRSxPQUFPLEVBQUU7RUFDNUIsRUFBQSxJQUFJLE9BQU9BLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLENBQUNGLEtBQUssQ0FBQyxFQUFFO01BQ3RELE1BQU1HLEdBQUcsR0FBR0gsS0FBZ0M7TUFDNUMsT0FBT1AsU0FBUyxDQUFDVyxNQUFNLENBQWEsQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEtBQUs7RUFDaEQsTUFBQSxNQUFNQyxDQUFDLEdBQUdKLEdBQUcsQ0FBQ0csR0FBRyxDQUFDO1FBQ2xCRCxHQUFHLENBQUNDLEdBQUcsQ0FBQyxHQUFHLE9BQU9DLENBQUMsS0FBSyxRQUFRLEdBQUdBLENBQUMsR0FBRyxFQUFFO0VBQ3pDLE1BQUEsT0FBT0YsR0FBRztNQUNaLENBQUMs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QyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7RUFDN0UsSUFBQSxDQUFLLENBQUM7RUFDTixDQUFDO0VBQ0QsSUFBSSxXQUFXLEdBQUcsQ0FBQ0EsY0FBSSxJQUFJQSxjQUFJLENBQUMsV0FBVyxLQUFLLFVBQVUsT0FBTyxFQUFFLElBQUksRUFBRTtFQUN6RSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLFFBQVEsR0FBRyxNQUFNLEVBQUUsU0FBUyxDQUFDO0VBQ3BNLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUEsQ0FBRSxDQUFDLEVBQUUsQ0FBQztFQUMvSixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElB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QyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFNLEtBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFB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QUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsSUFBSSwwQ0FBMEMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzs7RUFFL1osU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7O0VBRXRMLFNBQVMscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7O0VBRWhnQixTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJ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
