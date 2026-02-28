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
  AdminJS.UserComponents.ImageUploadField = ImageUploadField;

})(React, AdminJSDesignSystem, PropTypes);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvbGlua3MtZmllbGQudXRpbHMudHMiLCIuLi9zcmMvYWRtaW4vaG9va3MvdXNlTGlua3NGaWVsZC50cyIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtJdGVtL0xpbmtJdGVtLnRzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtzRmllbGQudHN4IiwiLi4vc3JjL3VwbG9hZC9jb25zdGFudHMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMudHMiLCIuLi9zcmMvYWRtaW4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC51dGlscy50cyIsIi4uL3NyYy9hZG1pbi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbmZpZy50cyIsIi4uL3NyYy9hZG1pbi9ob29rcy91c2VJbWFnZVVwbG9hZEZpZWxkLnRzIiwiLi4vc3JjL2FkbWluL2hvb2tzL3VzZU9iamVjdFVybHMudHMiLCIuLi9ub2RlX21vZHVsZXMvZmlsZS1zZWxlY3Rvci9kaXN0L2ZpbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvZmlsZS1zZWxlY3Rvci9kaXN0L2ZpbGUtc2VsZWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvZmlsZS1zZWxlY3Rvci9kaXN0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2F0dHItYWNjZXB0L2Rpc3QvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcmVhY3QtZHJvcHpvbmUvZGlzdC9lcy91dGlscy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdC1kcm9wem9uZS9kaXN0L2VzL2luZGV4LmpzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWQvSW1hZ2VVcGxvYWREcm9wem9uZS50c3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9JbWFnZVVwbG9hZC9JbWFnZVVwbG9hZFByZXZpZXdTdHJpcC50c3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9JbWFnZVVwbG9hZC9JbWFnZVVwbG9hZFRodW1ibmFpbC50c3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9JbWFnZVVwbG9hZC9JbWFnZVVwbG9hZEZpZWxkRWRpdC50c3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9JbWFnZVVwbG9hZC9JbWFnZVVwbG9hZEZpZWxkU2hvdy50c3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9JbWFnZVVwbG9hZC9JbWFnZVVwbG9hZEZpZWxkLnRzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBMSU5LX0tFWVMgPSBbXG4gICdmYWNlYm9vaycsXG4gICdpbnN0YWdyYW0nLFxuICAnYWlyYm5iJyxcbiAgJ2Jvb2tpbmcnLFxuXSBhcyBjb25zdDtcbmV4cG9ydCB0eXBlIExpbmtLZXkgPSAodHlwZW9mIExJTktfS0VZUylbbnVtYmVyXTtcblxuZXhwb3J0IHR5cGUgTGlua3NWYWx1ZSA9IFBhcnRpYWw8UmVjb3JkPExpbmtLZXksIHN0cmluZz4+O1xuXG5leHBvcnQgdHlwZSBMaW5rc0ZpZWxkUHJvcHMgPSB7XG4gIHByb3BlcnR5OiB7IHBhdGg6IHN0cmluZyB9O1xuICByZWNvcmQ/OiB7IHBhcmFtcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0gfCBudWxsO1xuICBvbkNoYW5nZT86IChwYXRoOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSA9PiB2b2lkO1xuICB3aGVyZTogJ3Nob3cnIHwgJ2xpc3QnIHwgJ2VkaXQnIHwgJ2ZpbHRlcic7XG59O1xuIiwiaW1wb3J0IHR5cGUgeyBMaW5rS2V5LCBMaW5rc1ZhbHVlIH0gZnJvbSAnLi4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMnO1xuaW1wb3J0IHsgTElOS19LRVlTIH0gZnJvbSAnLi4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMnO1xuXG5leHBvcnQgY29uc3QgTEFCRUxTOiBSZWNvcmQ8TGlua0tleSwgc3RyaW5nPiA9IHtcbiAgZmFjZWJvb2s6ICdGYWNlYm9vaycsXG4gIGluc3RhZ3JhbTogJ0luc3RhZ3JhbScsXG4gIGFpcmJuYjogJ0FpcmJuYicsXG4gIGJvb2tpbmc6ICdCb29raW5nLmNvbScsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMaW5rcyh2YWx1ZTogdW5rbm93bik6IExpbmtzVmFsdWUge1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBjb25zdCBvYmogPSB2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICByZXR1cm4gTElOS19LRVlTLnJlZHVjZTxMaW5rc1ZhbHVlPigoYWNjLCBrZXkpID0+IHtcbiAgICAgIGNvbnN0IHYgPSBvYmpba2V5XTtcbiAgICAgIGFjY1trZXldID0gdHlwZW9mIHYgPT09ICdzdHJpbmcnID8gdiA6ICcnO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZSh2YWx1ZSkgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgICByZXR1cm4gcGFyc2VMaW5rcyhwYXJzZWQpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge307XG59XG5cbi8qKiBHZXQgbGlua3MgZnJvbSByZWNvcmQucGFyYW1zOiBzdXBwb3J0cyBuZXN0ZWQgKHBhcmFtcy5saW5rcykgb3IgZmxhdHRlbmVkIChwYXJhbXNbJ2xpbmtzLmZhY2Vib29rJ10pLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExpbmtzRnJvbVBhcmFtcyhcbiAgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCxcbiAgcGF0aDogc3RyaW5nLFxuKTogTGlua3NWYWx1ZSB7XG4gIGlmICghcGFyYW1zKSByZXR1cm4ge307XG4gIGNvbnN0IG5lc3RlZCA9IHBhcmFtc1twYXRoXTtcbiAgaWYgKG5lc3RlZCAhPSBudWxsICYmIHR5cGVvZiBuZXN0ZWQgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG5lc3RlZCkpIHtcbiAgICByZXR1cm4gcGFyc2VMaW5rcyhuZXN0ZWQpO1xuICB9XG4gIGNvbnN0IHByZWZpeCA9IGAke3BhdGh9LmA7XG4gIHJldHVybiBMSU5LX0tFWVMucmVkdWNlPExpbmtzVmFsdWU+KChhY2MsIGtleSkgPT4ge1xuICAgIGNvbnN0IHYgPSBwYXJhbXNbYCR7cHJlZml4fSR7a2V5fWBdO1xuICAgIGFjY1trZXldID0gdHlwZW9mIHYgPT09ICdzdHJpbmcnID8gdiA6ICcnO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cbiIsImltcG9ydCB7IGdldExpbmtzRnJvbVBhcmFtcyB9IGZyb20gJy4uL3V0aWxzL2xpbmtzLWZpZWxkLnV0aWxzJztcbmltcG9ydCB0eXBlIHsgTGlua3NGaWVsZFByb3BzIH0gZnJvbSAnLi4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rS2V5IH0gZnJvbSAnLi4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlTGlua3NGaWVsZChwcm9wczogTGlua3NGaWVsZFByb3BzKSB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzO1xuICBjb25zdCBwYXRoID0gcHJvcGVydHkucGF0aDtcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXM7XG4gIGNvbnN0IGxpbmtzID0gZ2V0TGlua3NGcm9tUGFyYW1zKHBhcmFtcywgcGF0aCk7XG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGtleTogTGlua0tleSwgdmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICghb25DaGFuZ2UpIHJldHVybjtcbiAgICBvbkNoYW5nZShwYXRoLCB7IC4uLmxpbmtzLCBba2V5XTogdmFsdWUgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgcGF0aCwgbGlua3MsIGhhbmRsZUNoYW5nZSB9O1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgRm9ybUdyb3VwLCBMYWJlbCwgSW5wdXQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IExBQkVMUyB9IGZyb20gJy4uLy4uL3V0aWxzL2xpbmtzLWZpZWxkLnV0aWxzJztcbmltcG9ydCB0eXBlIHsgTGlua0tleSB9IGZyb20gJy4uLy4uL3R5cGVzL2xpbmtzLWZpZWxkLnR5cGVzJztcblxudHlwZSBMaW5rSXRlbUVkaXRQcm9wcyA9IHtcbiAgcGF0aDogc3RyaW5nO1xuICBsaW5rS2V5OiBMaW5rS2V5O1xuICB2YWx1ZTogc3RyaW5nO1xuICBvbkNoYW5nZTogKGtleTogTGlua0tleSwgdmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn07XG5cbnR5cGUgTGlua0l0ZW1TaG93UHJvcHMgPSB7XG4gIGxpbmtLZXk6IExpbmtLZXk7XG4gIHZhbHVlOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTGlua0l0ZW1FZGl0KHtcbiAgcGF0aCxcbiAgbGlua0tleSxcbiAgdmFsdWUsXG4gIG9uQ2hhbmdlLFxufTogTGlua0l0ZW1FZGl0UHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQge1xuICBjb25zdCBpZCA9IGAke3BhdGh9LSR7bGlua0tleX1gO1xuICByZXR1cm4gKFxuICAgIDxGb3JtR3JvdXAgbWI9XCJsZ1wiPlxuICAgICAgPExhYmVsIGh0bWxGb3I9e2lkfT57TEFCRUxTW2xpbmtLZXldfTwvTGFiZWw+XG4gICAgICA8SW5wdXRcbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICBvbkNoYW5nZShsaW5rS2V5LCAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgcGxhY2Vob2xkZXI9e2BodHRwczovLyR7bGlua0tleX0uY29tLy4uLmB9XG4gICAgICAvPlxuICAgIDwvRm9ybUdyb3VwPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTGlua0l0ZW1TaG93KHtcbiAgbGlua0tleSxcbiAgdmFsdWUsXG59OiBMaW5rSXRlbVNob3dQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIHJldHVybiAoXG4gICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgIDxMYWJlbD57TEFCRUxTW2xpbmtLZXldfTwvTGFiZWw+XG4gICAgICA8Qm94IG10PVwic21cIj5cbiAgICAgICAgPGEgaHJlZj17dmFsdWV9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIj5cbiAgICAgICAgICB7dmFsdWV9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApO1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgdXNlTGlua3NGaWVsZCB9IGZyb20gJy4uL2hvb2tzL3VzZUxpbmtzRmllbGQnO1xuaW1wb3J0IHsgTGlua0l0ZW1FZGl0LCBMaW5rSXRlbVNob3cgfSBmcm9tICcuL0xpbmtJdGVtL0xpbmtJdGVtJztcbmltcG9ydCB7IExJTktfS0VZUywgTGlua3NGaWVsZFByb3BzIH0gZnJvbSAnLi4vdHlwZXMvbGlua3MtZmllbGQudHlwZXMnO1xuXG5leHBvcnQgY29uc3QgTGlua3NGaWVsZDogUmVhY3QuRkM8TGlua3NGaWVsZFByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHdoZXJlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBwYXRoLCBsaW5rcywgaGFuZGxlQ2hhbmdlIH0gPSB1c2VMaW5rc0ZpZWxkKHByb3BzKTtcblxuICBpZiAod2hlcmUgPT09ICdlZGl0Jykge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94PlxuICAgICAgICB7TElOS19LRVlTLm1hcCgoa2V5KSA9PiAoXG4gICAgICAgICAgPExpbmtJdGVtRWRpdFxuICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICBwYXRoPXtwYXRofVxuICAgICAgICAgICAgbGlua0tleT17a2V5fVxuICAgICAgICAgICAgdmFsdWU9e2xpbmtzW2tleV0gPz8gJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG4gICAgKTtcbiAgfVxuXG4gIGlmICh3aGVyZSA9PT0gJ3Nob3cnIHx8IHdoZXJlID09PSAnbGlzdCcpIHtcbiAgICBjb25zdCBmaWxsZWQgPSBMSU5LX0tFWVMuZmlsdGVyKChrKSA9PiBsaW5rc1trXSk7XG4gICAgaWYgKGZpbGxlZC5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94PlxuICAgICAgICB7ZmlsbGVkLm1hcCgoa2V5KSA9PiAoXG4gICAgICAgICAgPExpbmtJdGVtU2hvdyBrZXk9e2tleX0gbGlua0tleT17a2V5fSB2YWx1ZT17bGlua3Nba2V5XSA/PyAnJ30gLz5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBMaW5rc0ZpZWxkO1xuIiwiaW1wb3J0IHsgSW1hZ2VNaW1lVHlwZSB9IGZyb20gJy4uL3R5cGVzL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IEFMTE9XRURfTUlNRVMgPSBbXG4gIEltYWdlTWltZVR5cGUuSlBFRyxcbiAgSW1hZ2VNaW1lVHlwZS5QTkcsXG4gIEltYWdlTWltZVR5cGUuV0VCUCxcbiAgSW1hZ2VNaW1lVHlwZS5HSUYsXG5dIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgTUFYX1NJWkUgPSAxMCAqIDEwMjQgKiAxMDI0OyAvLyAxME1CXG5cbmV4cG9ydCBjb25zdCBQQVRIX1BBVFRFUk4gPSAvXlthLXpBLVowLTlfLi1dKyhcXC9bYS16QS1aMC05Xy4tXSspKyQvO1xuXG5leHBvcnQgY29uc3QgQlVDS0VUID0gJ2FwYXJ0bWVudHMnO1xuIiwiaW1wb3J0IHsgSW1hZ2VNaW1lVHlwZSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL3R5cGVzJztcblxuLyoqIFB1YmxpYyBsYWJlbHMgZm9yIHRoZSBmaWVsZC4gKi9cbmV4cG9ydCBjb25zdCBMQUJFTFMgPSB7XG4gIG1haW5QaG90bzogJ01haW4gcGhvdG8nLFxuICBwaG90b3M6ICdQaG90b3MgKG11bHRpcGxlKScsXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgVVBMT0FEX1VSTCA9ICcvYXBpL3VwbG9hZCc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9TQVZFX0ZJUlNUX01FU1NBR0UgPVxuICAnU2F2ZSB0aGUgcmVjb3JkIGZpcnN0IHNvIGZpbGVzIGFyZSBzdG9yZWQgaW4gaXRzIGZvbGRlci4nO1xuZXhwb3J0IGNvbnN0IElNQUdFX0FDQ0VQVCA9IFtcbiAgSW1hZ2VNaW1lVHlwZS5KUEVHLFxuICBJbWFnZU1pbWVUeXBlLlBORyxcbiAgSW1hZ2VNaW1lVHlwZS5XRUJQLFxuICBJbWFnZU1pbWVUeXBlLkdJRixcbl0gYXMgY29uc3Q7XG5leHBvcnQgY29uc3QgVVBMT0FEX0VSUk9SX0ZBTExCQUNLID0gJ1VwbG9hZCBmYWlsZWQnO1xuXG4vKiogTUlNRSB0eXBlIHRvIGV4dGVuc2lvbnMgbWFwIGZvciByZWFjdC1kcm9wem9uZSBhY2NlcHQuICovXG5leHBvcnQgY29uc3QgSU1BR0VfQUNDRVBUX01BUCA9IHtcbiAgJ2ltYWdlL2pwZWcnOiBbJy5qcGcnLCAnLmpwZWcnXSxcbiAgJ2ltYWdlL3BuZyc6IFsnLnBuZyddLFxuICAnaW1hZ2Uvd2VicCc6IFsnLndlYnAnXSxcbiAgJ2ltYWdlL2dpZic6IFsnLmdpZiddLFxufSBhcyBjb25zdDtcblxuLyoqIFRodW1ibmFpbCBzaXplIGluIHB4OyB1c2VkIGZvciBncmlkIGFuZCBjYXJkIHdpZHRoLiAqL1xuZXhwb3J0IGNvbnN0IFRIVU1CX1NJWkUgPSAxNjA7XG5cbi8qKiBHcmlkIGxheW91dCBmb3IgdGh1bWJuYWlsIGxpc3RzIChlZGl0IGFuZCBzaG93KS4gKi9cbmV4cG9ydCBjb25zdCBUSFVNQl9HUklEX1NUWUxFID0ge1xuICBkaXNwbGF5OiAnZ3JpZCcsXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMTYwcHgsIDFmcikpJyxcbiAgZ2FwOiAxMixcbn0gYXMgY29uc3Q7XG5cbi8qKiBQcmV2aWV3IGltYWdlIHN0eWxlIHdoaWxlIGZpbGVzIGFyZSB1cGxvYWRpbmcuICovXG5leHBvcnQgY29uc3QgVVBMT0FESU5HX1BSRVZJRVdfU1RZTEUgPSB7XG4gIG1heEhlaWdodDogMjAwLFxuICBvYmplY3RGaXQ6ICdjb250YWluJyBhcyBjb25zdCxcbn07XG4iLCJpbXBvcnQgeyBCVUNLRVQgfSBmcm9tICcuLi8uLi8uLi91cGxvYWQvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIFVQTE9BRF9VUkwsXG4gIFVQTE9BRF9FUlJPUl9GQUxMQkFDSyxcbn0gZnJvbSAnLi9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcblxuLy8gLS0tIFBhcmFtcyAvIHJlY29yZCBoZWxwZXJzIC0tLVxuXG4vKipcbiAqIFJlYWQgaW1hZ2UgVVJMKHMpIGZyb20gcmVjb3JkIHBhcmFtcy5cbiAqIEFjY2VwdHMgcGFyYW1zW3BhdGhdIGFzIGFycmF5IG9yIHN0cmluZywgYW5kIHBhcmFtc1twYXRoLjBdLCBwYXJhbXNbcGF0aC4xXSwg4oCmXG4gKiBmb3IgbGVnYWN5IGZvcm0gcGF5bG9hZHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRVcmxzRnJvbVBhcmFtcyhcbiAgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCxcbiAgcGF0aDogc3RyaW5nLFxuICBpc011bHRpcGxlOiBib29sZWFuLFxuKTogc3RyaW5nW10ge1xuICBpZiAoaXNNdWx0aXBsZSkgcmV0dXJuIGdldEFycmF5RnJvbVBhcmFtcyhwYXJhbXMsIHBhdGgpO1xuICBjb25zdCB2ID0gcGFyYW1zPy5bcGF0aF07XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdiA/IFt2XSA6IFtdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVjb3JkSWQoXG4gIHJlY29yZDogeyBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9IHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zO1xuICByZXR1cm4gdHlwZW9mIHBhcmFtcz8uaWQgPT09ICdzdHJpbmcnID8gcGFyYW1zLmlkIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVTdHJpbmdBcnJheSh2YWx1ZTogdW5rbm93bik6IHN0cmluZ1tdIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLmZpbHRlcigodik6IHYgaXMgc3RyaW5nID0+IHR5cGVvZiB2ID09PSAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUpIHJldHVybiBbdmFsdWVdO1xuICByZXR1cm4gW107XG59XG5cbmZ1bmN0aW9uIGdldEFycmF5RnJvbVBhcmFtcyhcbiAgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCxcbiAgcGF0aDogc3RyaW5nLFxuKTogc3RyaW5nW10ge1xuICBpZiAoIXBhcmFtcykgcmV0dXJuIFtdO1xuICBjb25zdCBkaXJlY3QgPSBwYXJhbXNbcGF0aF07XG4gIGlmIChBcnJheS5pc0FycmF5KGRpcmVjdCkpIHtcbiAgICByZXR1cm4gZW5zdXJlU3RyaW5nQXJyYXkoZGlyZWN0KTtcbiAgfVxuICBjb25zdCBjb2xsZWN0ZWQ6IHN0cmluZ1tdID0gW107XG4gIGxldCBpID0gMDtcbiAgZm9yICg7Oykge1xuICAgIGNvbnN0IGtleSA9IGAke3BhdGh9LiR7aX1gO1xuICAgIGNvbnN0IHYgPSBwYXJhbXNba2V5XTtcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IG51bGwpIGJyZWFrO1xuICAgIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdikgY29sbGVjdGVkLnB1c2godik7XG4gICAgaSArPSAxO1xuICB9XG4gIHJldHVybiBjb2xsZWN0ZWQ7XG59XG5cbi8vIC0tLSBQYXRoIGFuZCBlcnJvciBoZWxwZXJzIC0tLVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRVcGxvYWRQYXRoKFxuICB1cGxvYWRQYXRoUHJlZml4OiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIHJlY29yZElkOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF1cGxvYWRQYXRoUHJlZml4IHx8IHR5cGVvZiB1cGxvYWRQYXRoUHJlZml4ICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHNlZ21lbnQgPSAocmVjb3JkSWQ/LnRyaW0oKSB8fCAnX25ldycpLnJlcGxhY2UoL1teYS16QS1aMC05Xy4tXS9nLCAnJyk7XG4gIGNvbnN0IHByZWZpeCA9IHVwbG9hZFBhdGhQcmVmaXgudHJpbSgpLnJlcGxhY2UoL1teYS16QS1aMC05Xy4tXS9nLCAnJyk7XG4gIHJldHVybiBwcmVmaXggPyBgJHtwcmVmaXh9LyR7c2VnbWVudH1gIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShcbiAgZXJyOiB1bmtub3duLFxuICBmYWxsYmFjayA9IFVQTE9BRF9FUlJPUl9GQUxMQkFDSyxcbik6IHN0cmluZyB7XG4gIHJldHVybiBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogZmFsbGJhY2s7XG59XG5cbi8vIC0tLSBVcGxvYWQgKHNpbmdsZSBoZWxwZXIpIC0tLVxuXG5hc3luYyBmdW5jdGlvbiB1cGxvYWRGaWxlKFxuICBmaWxlOiBGaWxlLFxuICB1cGxvYWRQYXRoOiBzdHJpbmcgfCBudWxsLFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgdXJsID0gbmV3IFVSTChVUExPQURfVVJMLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcbiAgaWYgKHVwbG9hZFBhdGgpIHtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldCgncGF0aCcsIHVwbG9hZFBhdGgpO1xuICB9XG4gIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwudG9TdHJpbmcoKSwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICB9KTtcblxuICBpZiAoIXJlcy5vaykge1xuICAgIGNvbnN0IGVyciA9IChhd2FpdCByZXNcbiAgICAgIC5qc29uKClcbiAgICAgIC5jYXRjaCgoKSA9PiAoeyBtZXNzYWdlOiByZXMuc3RhdHVzVGV4dCB9KSkpIGFzIHtcbiAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7XG4gICAgfTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UgPz8gJ1VwbG9hZCBmYWlsZWQnKTtcbiAgfVxuICBjb25zdCBkYXRhID0gKGF3YWl0IHJlcy5qc29uKCkpIGFzIHsgdXJsOiBzdHJpbmcgfTtcbiAgcmV0dXJuIGRhdGEudXJsO1xufVxuXG4vKipcbiAqIEV4dHJhY3Qgc3RvcmFnZSBrZXkgZnJvbSBhIFN1cGFiYXNlIHB1YmxpYyBVUkwuXG4gKiBVUkwgZm9ybWF0OiAuLi4vc3RvcmFnZS92MS9vYmplY3QvcHVibGljLzxidWNrZXQ+LzxrZXk+XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdG9yYWdlS2V5RnJvbVB1YmxpY1VybCh1cmw6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGhuYW1lID0gbmV3IFVSTCh1cmwpLnBhdGhuYW1lO1xuICAgIGNvbnN0IHByZWZpeCA9IGAvc3RvcmFnZS92MS9vYmplY3QvcHVibGljLyR7QlVDS0VUfS9gO1xuICAgIGlmICghcGF0aG5hbWUuc3RhcnRzV2l0aChwcmVmaXgpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gcGF0aG5hbWUuc2xpY2UocHJlZml4Lmxlbmd0aCkgfHwgbnVsbDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWxldGUgYSBmaWxlIGZyb20gc3RvcmFnZSBieSBpdHMgcHVibGljIFVSTCAob25seSB3b3JrcyBmb3IgU3VwYWJhc2UgcHVibGljIFVSTHMgZm9yIG91ciBidWNrZXQpLlxuICogTm8tb3AgaWYgdGhlIFVSTCBpcyBub3QgYSB2YWxpZCBzdG9yYWdlIFVSTCAoZS5nLiBibG9iIFVSTCkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVGaWxlQnlVcmwodXJsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qga2V5ID0gZ2V0U3RvcmFnZUtleUZyb21QdWJsaWNVcmwodXJsKTtcbiAgaWYgKCFrZXkpIHJldHVybjtcbiAgY29uc3QgZGVsZXRlVXJsID0gbmV3IFVSTChVUExPQURfVVJMLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcbiAgZGVsZXRlVXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3BhdGgnLCBrZXkpO1xuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChkZWxldGVVcmwudG9TdHJpbmcoKSwge1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gIH0pO1xuICBpZiAoIXJlcy5vaykge1xuICAgIGNvbnN0IGVyciA9IChhd2FpdCByZXNcbiAgICAgIC5qc29uKClcbiAgICAgIC5jYXRjaCgoKSA9PiAoeyBtZXNzYWdlOiByZXMuc3RhdHVzVGV4dCB9KSkpIGFzIHsgbWVzc2FnZT86IHN0cmluZyB9O1xuICAgIHRocm93IG5ldyBFcnJvcihlcnIubWVzc2FnZSA/PyAnRGVsZXRlIGZhaWxlZCcpO1xuICB9XG59XG5cbi8qKlxuICogVXBsb2FkIGZpbGVzIGFuZCByZXR1cm4gdGhlIG5leHQgdmFsdWUgZm9yIHRoZSBmaWVsZDogc2luZ2xlIFVSTCBvciBhcnJheSBvZiBVUkxzIGFwcGVuZGVkIHRvIGN1cnJlbnRVcmxzLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBsb2FkRmlsZXNBbmRCdWlsZE5leHRWYWx1ZShcbiAgZmlsZXM6IEZpbGVMaXN0IHwgRmlsZVtdLFxuICB1cGxvYWRQYXRoOiBzdHJpbmcgfCBudWxsLFxuICBpc011bHRpcGxlOiBib29sZWFuLFxuICBjdXJyZW50VXJsczogc3RyaW5nW10sXG4pOiBQcm9taXNlPHN0cmluZyB8IHN0cmluZ1tdPiB7XG4gIGNvbnN0IGxpc3QgPSBBcnJheS5mcm9tKGZpbGVzKTtcbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGlzTXVsdGlwbGUgPyBjdXJyZW50VXJscyA6ICcnO1xuICB9XG4gIGNvbnN0IHVybHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHVybHMucHVzaChhd2FpdCB1cGxvYWRGaWxlKGxpc3RbaV0sIHVwbG9hZFBhdGgpKTtcbiAgfVxuICBpZiAoaXNNdWx0aXBsZSkge1xuICAgIHJldHVybiBbLi4uY3VycmVudFVybHMsIC4uLnVybHNdO1xuICB9XG4gIHJldHVybiB1cmxzWzBdO1xufVxuIiwiaW1wb3J0IHsgREVGQVVMVF9TQVZFX0ZJUlNUX01FU1NBR0UgfSBmcm9tICcuL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBJbWFnZVVwbG9hZEZpZWxkUHJvcHMgfSBmcm9tICcuLi8uLi90eXBlcy9pbWFnZS11cGxvYWQtZmllbGQudHlwZXMnO1xuZXhwb3J0IHR5cGUgRmllbGRDb25maWcgPSB7XG4gIHBhdGg6IHN0cmluZztcbiAgaXNNdWx0aXBsZTogYm9vbGVhbjtcbiAgdXBsb2FkUGF0aFByZWZpeDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBzYXZlRmlyc3RNZXNzYWdlOiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEJ1aWxkIGZpZWxkIGNvbmZpZyBmcm9tIEFkbWluSlMgcHJvcGVydHkuXG4gKiBNdWx0aXBsZSB1cGxvYWQgaXMgZW5hYmxlZCB3aGVuIHBhdGggaXMgXCJwaG90b3NcIiAodXNlZCBmb3IgYXBhcnRtZW50IHBob3RvcykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZENvbmZpZyhcbiAgcHJvcGVydHk6IEltYWdlVXBsb2FkRmllbGRQcm9wc1sncHJvcGVydHknXSxcbik6IEZpZWxkQ29uZmlnIHtcbiAgcmV0dXJuIHtcbiAgICBwYXRoOiBwcm9wZXJ0eS5wYXRoLFxuICAgIGlzTXVsdGlwbGU6IHByb3BlcnR5LnBhdGggPT09ICdwaG90b3MnLFxuICAgIHVwbG9hZFBhdGhQcmVmaXg6IHByb3BlcnR5LmN1c3RvbT8udXBsb2FkUGF0aFByZWZpeCxcbiAgICBzYXZlRmlyc3RNZXNzYWdlOlxuICAgICAgcHJvcGVydHkuY3VzdG9tPy5zYXZlRmlyc3RNZXNzYWdlID8/IERFRkFVTFRfU0FWRV9GSVJTVF9NRVNTQUdFLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBidWlsZFVwbG9hZFBhdGgsXG4gIGdldFVybHNGcm9tUGFyYW1zLFxuICBnZXRSZWNvcmRJZCxcbiAgdXBsb2FkRmlsZXNBbmRCdWlsZE5leHRWYWx1ZSxcbiAgZ2V0RXJyb3JNZXNzYWdlLFxuICBkZWxldGVGaWxlQnlVcmwsXG59IGZyb20gJy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQudXRpbHMnO1xuaW1wb3J0IHsgZ2V0RmllbGRDb25maWcgfSBmcm9tICcuLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbmZpZyc7XG5pbXBvcnQgdHlwZSB7IEltYWdlVXBsb2FkRmllbGRQcm9wcyB9IGZyb20gJy4uL3R5cGVzL2ltYWdlLXVwbG9hZC1maWVsZC50eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VJbWFnZVVwbG9hZEZpZWxkKHByb3BzOiBJbWFnZVVwbG9hZEZpZWxkUHJvcHMpIHtcbiAgY29uc3QgeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9ID0gcHJvcHM7XG5cbiAgY29uc3QgY29uZmlnID0gZ2V0RmllbGRDb25maWcocHJvcGVydHkpO1xuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zO1xuICBjb25zdCByZWNvcmRJZCA9IGdldFJlY29yZElkKHJlY29yZCk7XG4gIGNvbnN0IHVwbG9hZFBhdGggPSBidWlsZFVwbG9hZFBhdGgoY29uZmlnLnVwbG9hZFBhdGhQcmVmaXgsIHJlY29yZElkKTtcbiAgY29uc3QgdXJscyA9IGdldFVybHNGcm9tUGFyYW1zKHBhcmFtcywgY29uZmlnLnBhdGgsIGNvbmZpZy5pc011bHRpcGxlKTtcblxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbdXBsb2FkaW5nRmlsZXMsIHNldFVwbG9hZGluZ0ZpbGVzXSA9IHVzZVN0YXRlPEZpbGVbXT4oW10pO1xuXG4gIGNvbnN0IGhhbmRsZUZpbGVzID0gYXN5bmMgKGZpbGVzOiBGaWxlW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWZpbGVzLmxlbmd0aCB8fCAhb25DaGFuZ2UpIHJldHVybjtcblxuICAgIHNldEVycm9yKG51bGwpO1xuICAgIHNldFVwbG9hZGluZyh0cnVlKTtcbiAgICBzZXRVcGxvYWRpbmdGaWxlcyhmaWxlcyk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5leHRWYWx1ZSA9IGF3YWl0IHVwbG9hZEZpbGVzQW5kQnVpbGROZXh0VmFsdWUoXG4gICAgICAgIGZpbGVzLFxuICAgICAgICB1cGxvYWRQYXRoLFxuICAgICAgICBjb25maWcuaXNNdWx0aXBsZSxcbiAgICAgICAgdXJscyxcbiAgICAgICk7XG4gICAgICBvbkNoYW5nZShjb25maWcucGF0aCwgbmV4dFZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHNldEVycm9yKGdldEVycm9yTWVzc2FnZShlcnIpKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKTtcbiAgICAgIHNldFVwbG9hZGluZ0ZpbGVzKFtdKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlVXJsID0gKGluZGV4OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoIW9uQ2hhbmdlKSByZXR1cm47XG4gICAgY29uc3QgdXJsVG9SZW1vdmUgPSB1cmxzW2luZGV4XTtcbiAgICBpZiAodXJsVG9SZW1vdmUpIHtcbiAgICAgIHZvaWQgZGVsZXRlRmlsZUJ5VXJsKHVybFRvUmVtb3ZlKS5jYXRjaCgoKSA9PiB7XG4gICAgICAgIC8vIEZpcmUtYW5kLWZvcmdldDogaW1hZ2UgaXMgcmVtb3ZlZCBmcm9tIGZvcm0gZWl0aGVyIHdheVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChjb25maWcuaXNNdWx0aXBsZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHVybHMuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCk7XG4gICAgICBvbkNoYW5nZShjb25maWcucGF0aCwgbmV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uQ2hhbmdlKGNvbmZpZy5wYXRoLCAnJyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZmllbGQ6IHtcbiAgICAgIHBhdGg6IGNvbmZpZy5wYXRoLFxuICAgICAgaXNNdWx0aXBsZTogY29uZmlnLmlzTXVsdGlwbGUsXG4gICAgICB1cmxzLFxuICAgICAgdXBsb2FkaW5nRmlsZXMsXG4gICAgICB1cGxvYWRQYXRoLFxuICAgICAgdXBsb2FkUGF0aFByZWZpeDogY29uZmlnLnVwbG9hZFBhdGhQcmVmaXgsXG4gICAgICByZWNvcmRJZCxcbiAgICAgIHNhdmVGaXJzdE1lc3NhZ2U6IGNvbmZpZy5zYXZlRmlyc3RNZXNzYWdlLFxuICAgIH0sXG4gICAgc3RhdHVzOiB7IHVwbG9hZGluZywgZXJyb3IgfSxcbiAgICBhY3Rpb25zOiB7IGhhbmRsZUZpbGVzLCByZW1vdmVVcmwgfSxcbiAgfTtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogUmV0dXJucyBvYmplY3QgVVJMcyBmb3IgdGhlIGdpdmVuIGZpbGVzIGFuZCByZXZva2VzIHRoZW0gb24gY2xlYW51cC5cbiAqIFVzZSBmb3IgcHJldmlld2luZyBGaWxlIG9iamVjdHMgYmVmb3JlIHVwbG9hZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZU9iamVjdFVybHMoZmlsZXM6IEZpbGVbXSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgW3VybHMsIHNldFVybHNdID0gdXNlU3RhdGU8c3RyaW5nW10+KFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHNldFVybHMoW10pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXh0ID0gZmlsZXMubWFwKChmKSA9PiBVUkwuY3JlYXRlT2JqZWN0VVJMKGYpKTtcbiAgICBzZXRVcmxzKG5leHQpO1xuICAgIHJldHVybiAoKSA9PiBuZXh0LmZvckVhY2goKHVybCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpKTtcbiAgfSwgW2ZpbGVzXSk7XG5cbiAgcmV0dXJuIHVybHM7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ09NTU9OX01JTUVfVFlQRVMgPSB2b2lkIDA7XG5leHBvcnRzLnRvRmlsZVdpdGhQYXRoID0gdG9GaWxlV2l0aFBhdGg7XG5leHBvcnRzLkNPTU1PTl9NSU1FX1RZUEVTID0gbmV3IE1hcChbXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2d1enpsZS9wc3I3L2Jsb2IvMmQ5MjYwNzk5ZTcxM2YxYzQ3NWQzYzVmZGMzZDY1NjFmZjc0NDFiMi9zcmMvTWltZVR5cGUucGhwXG4gICAgWycxa20nLCAnYXBwbGljYXRpb24vdm5kLjEwMDBtaW5kcy5kZWNpc2lvbi1tb2RlbCt4bWwnXSxcbiAgICBbJzNkbWwnLCAndGV4dC92bmQuaW4zZC4zZG1sJ10sXG4gICAgWyczZHMnLCAnaW1hZ2UveC0zZHMnXSxcbiAgICBbJzNnMicsICd2aWRlby8zZ3BwMiddLFxuICAgIFsnM2dwJywgJ3ZpZGVvLzNncCddLFxuICAgIFsnM2dwcCcsICd2aWRlby8zZ3BwJ10sXG4gICAgWyczbWYnLCAnbW9kZWwvM21mJ10sXG4gICAgWyc3eicsICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnXSxcbiAgICBbJzd6aXAnLCAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJ10sXG4gICAgWycxMjMnLCAnYXBwbGljYXRpb24vdm5kLmxvdHVzLTEtMi0zJ10sXG4gICAgWydhYWInLCAnYXBwbGljYXRpb24veC1hdXRob3J3YXJlLWJpbiddLFxuICAgIFsnYWFjJywgJ2F1ZGlvL3gtYWNjJ10sXG4gICAgWydhYW0nLCAnYXBwbGljYXRpb24veC1hdXRob3J3YXJlLW1hcCddLFxuICAgIFsnYWFzJywgJ2FwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1zZWcnXSxcbiAgICBbJ2FidycsICdhcHBsaWNhdGlvbi94LWFiaXdvcmQnXSxcbiAgICBbJ2FjJywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2UuYWMreG1sJ10sXG4gICAgWydhYzMnLCAnYXVkaW8vYWMzJ10sXG4gICAgWydhY2MnLCAnYXBwbGljYXRpb24vdm5kLmFtZXJpY2FuZHluYW1pY3MuYWNjJ10sXG4gICAgWydhY2UnLCAnYXBwbGljYXRpb24veC1hY2UtY29tcHJlc3NlZCddLFxuICAgIFsnYWN1JywgJ2FwcGxpY2F0aW9uL3ZuZC5hY3Vjb2JvbCddLFxuICAgIFsnYWN1dGMnLCAnYXBwbGljYXRpb24vdm5kLmFjdWNvcnAnXSxcbiAgICBbJ2FkcCcsICdhdWRpby9hZHBjbSddLFxuICAgIFsnYWVwJywgJ2FwcGxpY2F0aW9uL3ZuZC5hdWRpb2dyYXBoJ10sXG4gICAgWydhZm0nLCAnYXBwbGljYXRpb24veC1mb250LXR5cGUxJ10sXG4gICAgWydhZnAnLCAnYXBwbGljYXRpb24vdm5kLmlibS5tb2RjYXAnXSxcbiAgICBbJ2FoZWFkJywgJ2FwcGxpY2F0aW9uL3ZuZC5haGVhZC5zcGFjZSddLFxuICAgIFsnYWknLCAnYXBwbGljYXRpb24vcGRmJ10sXG4gICAgWydhaWYnLCAnYXVkaW8veC1haWZmJ10sXG4gICAgWydhaWZjJywgJ2F1ZGlvL3gtYWlmZiddLFxuICAgIFsnYWlmZicsICdhdWRpby94LWFpZmYnXSxcbiAgICBbJ2FpcicsICdhcHBsaWNhdGlvbi92bmQuYWRvYmUuYWlyLWFwcGxpY2F0aW9uLWluc3RhbGxlci1wYWNrYWdlK3ppcCddLFxuICAgIFsnYWl0JywgJ2FwcGxpY2F0aW9uL3ZuZC5kdmIuYWl0J10sXG4gICAgWydhbWknLCAnYXBwbGljYXRpb24vdm5kLmFtaWdhLmFtaSddLFxuICAgIFsnYW1yJywgJ2F1ZGlvL2FtciddLFxuICAgIFsnYXBrJywgJ2FwcGxpY2F0aW9uL3ZuZC5hbmRyb2lkLnBhY2thZ2UtYXJjaGl2ZSddLFxuICAgIFsnYXBuZycsICdpbWFnZS9hcG5nJ10sXG4gICAgWydhcHBjYWNoZScsICd0ZXh0L2NhY2hlLW1hbmlmZXN0J10sXG4gICAgWydhcHBsaWNhdGlvbicsICdhcHBsaWNhdGlvbi94LW1zLWFwcGxpY2F0aW9uJ10sXG4gICAgWydhcHInLCAnYXBwbGljYXRpb24vdm5kLmxvdHVzLWFwcHJvYWNoJ10sXG4gICAgWydhcmMnLCAnYXBwbGljYXRpb24veC1mcmVlYXJjJ10sXG4gICAgWydhcmonLCAnYXBwbGljYXRpb24veC1hcmonXSxcbiAgICBbJ2FzYycsICdhcHBsaWNhdGlvbi9wZ3Atc2lnbmF0dXJlJ10sXG4gICAgWydhc2YnLCAndmlkZW8veC1tcy1hc2YnXSxcbiAgICBbJ2FzbScsICd0ZXh0L3gtYXNtJ10sXG4gICAgWydhc28nLCAnYXBwbGljYXRpb24vdm5kLmFjY3BhYy5zaW1wbHkuYXNvJ10sXG4gICAgWydhc3gnLCAndmlkZW8veC1tcy1hc2YnXSxcbiAgICBbJ2F0YycsICdhcHBsaWNhdGlvbi92bmQuYWN1Y29ycCddLFxuICAgIFsnYXRvbScsICdhcHBsaWNhdGlvbi9hdG9tK3htbCddLFxuICAgIFsnYXRvbWNhdCcsICdhcHBsaWNhdGlvbi9hdG9tY2F0K3htbCddLFxuICAgIFsnYXRvbWRlbGV0ZWQnLCAnYXBwbGljYXRpb24vYXRvbWRlbGV0ZWQreG1sJ10sXG4gICAgWydhdG9tc3ZjJywgJ2FwcGxpY2F0aW9uL2F0b21zdmMreG1sJ10sXG4gICAgWydhdHgnLCAnYXBwbGljYXRpb24vdm5kLmFudGl4LmdhbWUtY29tcG9uZW50J10sXG4gICAgWydhdScsICdhdWRpby94LWF1J10sXG4gICAgWydhdmknLCAndmlkZW8veC1tc3ZpZGVvJ10sXG4gICAgWydhdmlmJywgJ2ltYWdlL2F2aWYnXSxcbiAgICBbJ2F3JywgJ2FwcGxpY2F0aW9uL2FwcGxpeHdhcmUnXSxcbiAgICBbJ2F6ZicsICdhcHBsaWNhdGlvbi92bmQuYWlyemlwLmZpbGVzZWN1cmUuYXpmJ10sXG4gICAgWydhenMnLCAnYXBwbGljYXRpb24vdm5kLmFpcnppcC5maWxlc2VjdXJlLmF6cyddLFxuICAgIFsnYXp2JywgJ2ltYWdlL3ZuZC5haXJ6aXAuYWNjZWxlcmF0b3IuYXp2J10sXG4gICAgWydhencnLCAnYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9vayddLFxuICAgIFsnYjE2JywgJ2ltYWdlL3ZuZC5wY28uYjE2J10sXG4gICAgWydiYXQnLCAnYXBwbGljYXRpb24veC1tc2Rvd25sb2FkJ10sXG4gICAgWydiY3BpbycsICdhcHBsaWNhdGlvbi94LWJjcGlvJ10sXG4gICAgWydiZGYnLCAnYXBwbGljYXRpb24veC1mb250LWJkZiddLFxuICAgIFsnYmRtJywgJ2FwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG0rd2J4bWwnXSxcbiAgICBbJ2Jkb2MnLCAnYXBwbGljYXRpb24veC1iZG9jJ10sXG4gICAgWydiZWQnLCAnYXBwbGljYXRpb24vdm5kLnJlYWx2bmMuYmVkJ10sXG4gICAgWydiaDInLCAnYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXNwcnMnXSxcbiAgICBbJ2JpbicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2JsYicsICdhcHBsaWNhdGlvbi94LWJsb3JiJ10sXG4gICAgWydibG9yYicsICdhcHBsaWNhdGlvbi94LWJsb3JiJ10sXG4gICAgWydibWknLCAnYXBwbGljYXRpb24vdm5kLmJtaSddLFxuICAgIFsnYm1tbCcsICdhcHBsaWNhdGlvbi92bmQuYmFsc2FtaXEuYm1tbCt4bWwnXSxcbiAgICBbJ2JtcCcsICdpbWFnZS9ibXAnXSxcbiAgICBbJ2Jvb2snLCAnYXBwbGljYXRpb24vdm5kLmZyYW1lbWFrZXInXSxcbiAgICBbJ2JveCcsICdhcHBsaWNhdGlvbi92bmQucHJldmlld3N5c3RlbXMuYm94J10sXG4gICAgWydib3onLCAnYXBwbGljYXRpb24veC1iemlwMiddLFxuICAgIFsnYnBrJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnYnBtbicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2JzcCcsICdtb2RlbC92bmQudmFsdmUuc291cmNlLmNvbXBpbGVkLW1hcCddLFxuICAgIFsnYnRpZicsICdpbWFnZS9wcnMuYnRpZiddLFxuICAgIFsnYnVmZmVyJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnYnonLCAnYXBwbGljYXRpb24veC1iemlwJ10sXG4gICAgWydiejInLCAnYXBwbGljYXRpb24veC1iemlwMiddLFxuICAgIFsnYycsICd0ZXh0L3gtYyddLFxuICAgIFsnYzRkJywgJ2FwcGxpY2F0aW9uL3ZuZC5jbG9uay5jNGdyb3VwJ10sXG4gICAgWydjNGYnLCAnYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXAnXSxcbiAgICBbJ2M0ZycsICdhcHBsaWNhdGlvbi92bmQuY2xvbmsuYzRncm91cCddLFxuICAgIFsnYzRwJywgJ2FwcGxpY2F0aW9uL3ZuZC5jbG9uay5jNGdyb3VwJ10sXG4gICAgWydjNHUnLCAnYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXAnXSxcbiAgICBbJ2MxMWFtYycsICdhcHBsaWNhdGlvbi92bmQuY2x1ZXRydXN0LmNhcnRvbW9iaWxlLWNvbmZpZyddLFxuICAgIFsnYzExYW16JywgJ2FwcGxpY2F0aW9uL3ZuZC5jbHVldHJ1c3QuY2FydG9tb2JpbGUtY29uZmlnLXBrZyddLFxuICAgIFsnY2FiJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1jYWItY29tcHJlc3NlZCddLFxuICAgIFsnY2FmJywgJ2F1ZGlvL3gtY2FmJ10sXG4gICAgWydjYXAnLCAnYXBwbGljYXRpb24vdm5kLnRjcGR1bXAucGNhcCddLFxuICAgIFsnY2FyJywgJ2FwcGxpY2F0aW9uL3ZuZC5jdXJsLmNhciddLFxuICAgIFsnY2F0JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wa2kuc2VjY2F0J10sXG4gICAgWydjYjcnLCAnYXBwbGljYXRpb24veC1jYnInXSxcbiAgICBbJ2NiYScsICdhcHBsaWNhdGlvbi94LWNiciddLFxuICAgIFsnY2JyJywgJ2FwcGxpY2F0aW9uL3gtY2JyJ10sXG4gICAgWydjYnQnLCAnYXBwbGljYXRpb24veC1jYnInXSxcbiAgICBbJ2NieicsICdhcHBsaWNhdGlvbi94LWNiciddLFxuICAgIFsnY2MnLCAndGV4dC94LWMnXSxcbiAgICBbJ2NjbycsICdhcHBsaWNhdGlvbi94LWNvY29hJ10sXG4gICAgWydjY3QnLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnY2N4bWwnLCAnYXBwbGljYXRpb24vY2N4bWwreG1sJ10sXG4gICAgWydjZGJjbXNnJywgJ2FwcGxpY2F0aW9uL3ZuZC5jb250YWN0LmNtc2cnXSxcbiAgICBbJ2NkYScsICdhcHBsaWNhdGlvbi94LWNkZiddLFxuICAgIFsnY2RmJywgJ2FwcGxpY2F0aW9uL3gtbmV0Y2RmJ10sXG4gICAgWydjZGZ4JywgJ2FwcGxpY2F0aW9uL2NkZngreG1sJ10sXG4gICAgWydjZGtleScsICdhcHBsaWNhdGlvbi92bmQubWVkaWFzdGF0aW9uLmNka2V5J10sXG4gICAgWydjZG1pYScsICdhcHBsaWNhdGlvbi9jZG1pLWNhcGFiaWxpdHknXSxcbiAgICBbJ2NkbWljJywgJ2FwcGxpY2F0aW9uL2NkbWktY29udGFpbmVyJ10sXG4gICAgWydjZG1pZCcsICdhcHBsaWNhdGlvbi9jZG1pLWRvbWFpbiddLFxuICAgIFsnY2RtaW8nLCAnYXBwbGljYXRpb24vY2RtaS1vYmplY3QnXSxcbiAgICBbJ2NkbWlxJywgJ2FwcGxpY2F0aW9uL2NkbWktcXVldWUnXSxcbiAgICBbJ2NkcicsICdhcHBsaWNhdGlvbi9jZHInXSxcbiAgICBbJ2NkeCcsICdjaGVtaWNhbC94LWNkeCddLFxuICAgIFsnY2R4bWwnLCAnYXBwbGljYXRpb24vdm5kLmNoZW1kcmF3K3htbCddLFxuICAgIFsnY2R5JywgJ2FwcGxpY2F0aW9uL3ZuZC5jaW5kZXJlbGxhJ10sXG4gICAgWydjZXInLCAnYXBwbGljYXRpb24vcGtpeC1jZXJ0J10sXG4gICAgWydjZnMnLCAnYXBwbGljYXRpb24veC1jZnMtY29tcHJlc3NlZCddLFxuICAgIFsnY2dtJywgJ2ltYWdlL2NnbSddLFxuICAgIFsnY2hhdCcsICdhcHBsaWNhdGlvbi94LWNoYXQnXSxcbiAgICBbJ2NobScsICdhcHBsaWNhdGlvbi92bmQubXMtaHRtbGhlbHAnXSxcbiAgICBbJ2NocnQnLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rY2hhcnQnXSxcbiAgICBbJ2NpZicsICdjaGVtaWNhbC94LWNpZiddLFxuICAgIFsnY2lpJywgJ2FwcGxpY2F0aW9uL3ZuZC5hbnNlci13ZWItY2VydGlmaWNhdGUtaXNzdWUtaW5pdGlhdGlvbiddLFxuICAgIFsnY2lsJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1hcnRnYWxyeSddLFxuICAgIFsnY2pzJywgJ2FwcGxpY2F0aW9uL25vZGUnXSxcbiAgICBbJ2NsYScsICdhcHBsaWNhdGlvbi92bmQuY2xheW1vcmUnXSxcbiAgICBbJ2NsYXNzJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnY2xraycsICdhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci5rZXlib2FyZCddLFxuICAgIFsnY2xrcCcsICdhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci5wYWxldHRlJ10sXG4gICAgWydjbGt0JywgJ2FwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLnRlbXBsYXRlJ10sXG4gICAgWydjbGt3JywgJ2FwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLndvcmRiYW5rJ10sXG4gICAgWydjbGt4JywgJ2FwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyJ10sXG4gICAgWydjbHAnLCAnYXBwbGljYXRpb24veC1tc2NsaXAnXSxcbiAgICBbJ2NtYycsICdhcHBsaWNhdGlvbi92bmQuY29zbW9jYWxsZXInXSxcbiAgICBbJ2NtZGYnLCAnY2hlbWljYWwveC1jbWRmJ10sXG4gICAgWydjbWwnLCAnY2hlbWljYWwveC1jbWwnXSxcbiAgICBbJ2NtcCcsICdhcHBsaWNhdGlvbi92bmQueWVsbG93cml2ZXItY3VzdG9tLW1lbnUnXSxcbiAgICBbJ2NteCcsICdpbWFnZS94LWNteCddLFxuICAgIFsnY29kJywgJ2FwcGxpY2F0aW9uL3ZuZC5yaW0uY29kJ10sXG4gICAgWydjb2ZmZWUnLCAndGV4dC9jb2ZmZWVzY3JpcHQnXSxcbiAgICBbJ2NvbScsICdhcHBsaWNhdGlvbi94LW1zZG93bmxvYWQnXSxcbiAgICBbJ2NvbmYnLCAndGV4dC9wbGFpbiddLFxuICAgIFsnY3BpbycsICdhcHBsaWNhdGlvbi94LWNwaW8nXSxcbiAgICBbJ2NwcCcsICd0ZXh0L3gtYyddLFxuICAgIFsnY3B0JywgJ2FwcGxpY2F0aW9uL21hYy1jb21wYWN0cHJvJ10sXG4gICAgWydjcmQnLCAnYXBwbGljYXRpb24veC1tc2NhcmRmaWxlJ10sXG4gICAgWydjcmwnLCAnYXBwbGljYXRpb24vcGtpeC1jcmwnXSxcbiAgICBbJ2NydCcsICdhcHBsaWNhdGlvbi94LXg1MDktY2EtY2VydCddLFxuICAgIFsnY3J4JywgJ2FwcGxpY2F0aW9uL3gtY2hyb21lLWV4dGVuc2lvbiddLFxuICAgIFsnY3J5cHRvbm90ZScsICdhcHBsaWNhdGlvbi92bmQucmlnLmNyeXB0b25vdGUnXSxcbiAgICBbJ2NzaCcsICdhcHBsaWNhdGlvbi94LWNzaCddLFxuICAgIFsnY3NsJywgJ2FwcGxpY2F0aW9uL3ZuZC5jaXRhdGlvbnN0eWxlcy5zdHlsZSt4bWwnXSxcbiAgICBbJ2NzbWwnLCAnY2hlbWljYWwveC1jc21sJ10sXG4gICAgWydjc3AnLCAnYXBwbGljYXRpb24vdm5kLmNvbW1vbnNwYWNlJ10sXG4gICAgWydjc3InLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydjc3MnLCAndGV4dC9jc3MnXSxcbiAgICBbJ2NzdCcsICdhcHBsaWNhdGlvbi94LWRpcmVjdG9yJ10sXG4gICAgWydjc3YnLCAndGV4dC9jc3YnXSxcbiAgICBbJ2N1JywgJ2FwcGxpY2F0aW9uL2N1LXNlZW1lJ10sXG4gICAgWydjdXJsJywgJ3RleHQvdm5kLmN1cmwnXSxcbiAgICBbJ2N3dycsICdhcHBsaWNhdGlvbi9wcnMuY3d3J10sXG4gICAgWydjeHQnLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnY3h4JywgJ3RleHQveC1jJ10sXG4gICAgWydkYWUnLCAnbW9kZWwvdm5kLmNvbGxhZGEreG1sJ10sXG4gICAgWydkYWYnLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy5kYWYnXSxcbiAgICBbJ2RhcnQnLCAnYXBwbGljYXRpb24vdm5kLmRhcnQnXSxcbiAgICBbJ2RhdGFsZXNzJywgJ2FwcGxpY2F0aW9uL3ZuZC5mZHNuLnNlZWQnXSxcbiAgICBbJ2Rhdm1vdW50JywgJ2FwcGxpY2F0aW9uL2Rhdm1vdW50K3htbCddLFxuICAgIFsnZGJmJywgJ2FwcGxpY2F0aW9uL3ZuZC5kYmYnXSxcbiAgICBbJ2RiaycsICdhcHBsaWNhdGlvbi9kb2Nib29rK3htbCddLFxuICAgIFsnZGNyJywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2RjdXJsJywgJ3RleHQvdm5kLmN1cmwuZGN1cmwnXSxcbiAgICBbJ2RkMicsICdhcHBsaWNhdGlvbi92bmQub21hLmRkMit4bWwnXSxcbiAgICBbJ2RkZCcsICdhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRkZCddLFxuICAgIFsnZGRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG1kZGYreG1sJ10sXG4gICAgWydkZHMnLCAnaW1hZ2Uvdm5kLm1zLWRkcyddLFxuICAgIFsnZGViJywgJ2FwcGxpY2F0aW9uL3gtZGViaWFuLXBhY2thZ2UnXSxcbiAgICBbJ2RlZicsICd0ZXh0L3BsYWluJ10sXG4gICAgWydkZXBsb3knLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkZXInLCAnYXBwbGljYXRpb24veC14NTA5LWNhLWNlcnQnXSxcbiAgICBbJ2RmYWMnLCAnYXBwbGljYXRpb24vdm5kLmRyZWFtZmFjdG9yeSddLFxuICAgIFsnZGdjJywgJ2FwcGxpY2F0aW9uL3gtZGdjLWNvbXByZXNzZWQnXSxcbiAgICBbJ2RpYycsICd0ZXh0L3gtYyddLFxuICAgIFsnZGlyJywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2RpcycsICdhcHBsaWNhdGlvbi92bmQubW9iaXVzLmRpcyddLFxuICAgIFsnZGlzcG9zaXRpb24tbm90aWZpY2F0aW9uJywgJ21lc3NhZ2UvZGlzcG9zaXRpb24tbm90aWZpY2F0aW9uJ10sXG4gICAgWydkaXN0JywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZGlzdHonLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydkanYnLCAnaW1hZ2Uvdm5kLmRqdnUnXSxcbiAgICBbJ2RqdnUnLCAnaW1hZ2Uvdm5kLmRqdnUnXSxcbiAgICBbJ2RsbCcsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2RtZycsICdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZSddLFxuICAgIFsnZG1uJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZG1wJywgJ2FwcGxpY2F0aW9uL3ZuZC50Y3BkdW1wLnBjYXAnXSxcbiAgICBbJ2RtcycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2RuYScsICdhcHBsaWNhdGlvbi92bmQuZG5hJ10sXG4gICAgWydkb2MnLCAnYXBwbGljYXRpb24vbXN3b3JkJ10sXG4gICAgWydkb2NtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsnZG9jeCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCddLFxuICAgIFsnZG90JywgJ2FwcGxpY2F0aW9uL21zd29yZCddLFxuICAgIFsnZG90bScsICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ2RvdHgnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwudGVtcGxhdGUnXSxcbiAgICBbJ2RwJywgJ2FwcGxpY2F0aW9uL3ZuZC5vc2dpLmRwJ10sXG4gICAgWydkcGcnLCAnYXBwbGljYXRpb24vdm5kLmRwZ3JhcGgnXSxcbiAgICBbJ2RyYScsICdhdWRpby92bmQuZHJhJ10sXG4gICAgWydkcmxlJywgJ2ltYWdlL2RpY29tLXJsZSddLFxuICAgIFsnZHNjJywgJ3RleHQvcHJzLmxpbmVzLnRhZyddLFxuICAgIFsnZHNzYycsICdhcHBsaWNhdGlvbi9kc3NjK2RlciddLFxuICAgIFsnZHRiJywgJ2FwcGxpY2F0aW9uL3gtZHRib29rK3htbCddLFxuICAgIFsnZHRkJywgJ2FwcGxpY2F0aW9uL3htbC1kdGQnXSxcbiAgICBbJ2R0cycsICdhdWRpby92bmQuZHRzJ10sXG4gICAgWydkdHNoZCcsICdhdWRpby92bmQuZHRzLmhkJ10sXG4gICAgWydkdW1wJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnZHZiJywgJ3ZpZGVvL3ZuZC5kdmIuZmlsZSddLFxuICAgIFsnZHZpJywgJ2FwcGxpY2F0aW9uL3gtZHZpJ10sXG4gICAgWydkd2QnLCAnYXBwbGljYXRpb24vYXRzYy1kd2QreG1sJ10sXG4gICAgWydkd2YnLCAnbW9kZWwvdm5kLmR3ZiddLFxuICAgIFsnZHdnJywgJ2ltYWdlL3ZuZC5kd2cnXSxcbiAgICBbJ2R4ZicsICdpbWFnZS92bmQuZHhmJ10sXG4gICAgWydkeHAnLCAnYXBwbGljYXRpb24vdm5kLnNwb3RmaXJlLmR4cCddLFxuICAgIFsnZHhyJywgJ2FwcGxpY2F0aW9uL3gtZGlyZWN0b3InXSxcbiAgICBbJ2VhcicsICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnXSxcbiAgICBbJ2VjZWxwNDgwMCcsICdhdWRpby92bmQubnVlcmEuZWNlbHA0ODAwJ10sXG4gICAgWydlY2VscDc0NzAnLCAnYXVkaW8vdm5kLm51ZXJhLmVjZWxwNzQ3MCddLFxuICAgIFsnZWNlbHA5NjAwJywgJ2F1ZGlvL3ZuZC5udWVyYS5lY2VscDk2MDAnXSxcbiAgICBbJ2VjbWEnLCAnYXBwbGljYXRpb24vZWNtYXNjcmlwdCddLFxuICAgIFsnZWRtJywgJ2FwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5lZG0nXSxcbiAgICBbJ2VkeCcsICdhcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZWR4J10sXG4gICAgWydlZmlmJywgJ2FwcGxpY2F0aW9uL3ZuZC5waWNzZWwnXSxcbiAgICBbJ2VpNicsICdhcHBsaWNhdGlvbi92bmQucGcub3Nhc2xpJ10sXG4gICAgWydlbGMnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydlbWYnLCAnaW1hZ2UvZW1mJ10sXG4gICAgWydlbWwnLCAnbWVzc2FnZS9yZmM4MjInXSxcbiAgICBbJ2VtbWEnLCAnYXBwbGljYXRpb24vZW1tYSt4bWwnXSxcbiAgICBbJ2Vtb3Rpb25tbCcsICdhcHBsaWNhdGlvbi9lbW90aW9ubWwreG1sJ10sXG4gICAgWydlbXonLCAnYXBwbGljYXRpb24veC1tc21ldGFmaWxlJ10sXG4gICAgWydlb2wnLCAnYXVkaW8vdm5kLmRpZ2l0YWwtd2luZHMnXSxcbiAgICBbJ2VvdCcsICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCddLFxuICAgIFsnZXBzJywgJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXSxcbiAgICBbJ2VwdWInLCAnYXBwbGljYXRpb24vZXB1Yit6aXAnXSxcbiAgICBbJ2VzJywgJ2FwcGxpY2F0aW9uL2VjbWFzY3JpcHQnXSxcbiAgICBbJ2VzMycsICdhcHBsaWNhdGlvbi92bmQuZXN6aWdubzMreG1sJ10sXG4gICAgWydlc2EnLCAnYXBwbGljYXRpb24vdm5kLm9zZ2kuc3Vic3lzdGVtJ10sXG4gICAgWydlc2YnLCAnYXBwbGljYXRpb24vdm5kLmVwc29uLmVzZiddLFxuICAgIFsnZXQzJywgJ2FwcGxpY2F0aW9uL3ZuZC5lc3ppZ25vMyt4bWwnXSxcbiAgICBbJ2V0eCcsICd0ZXh0L3gtc2V0ZXh0J10sXG4gICAgWydldmEnLCAnYXBwbGljYXRpb24veC1ldmEnXSxcbiAgICBbJ2V2eScsICdhcHBsaWNhdGlvbi94LWVudm95J10sXG4gICAgWydleGUnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydleGknLCAnYXBwbGljYXRpb24vZXhpJ10sXG4gICAgWydleHAnLCAnYXBwbGljYXRpb24vZXhwcmVzcyddLFxuICAgIFsnZXhyJywgJ2ltYWdlL2FjZXMnXSxcbiAgICBbJ2V4dCcsICdhcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZXh0J10sXG4gICAgWydleicsICdhcHBsaWNhdGlvbi9hbmRyZXctaW5zZXQnXSxcbiAgICBbJ2V6MicsICdhcHBsaWNhdGlvbi92bmQuZXpwaXgtYWxidW0nXSxcbiAgICBbJ2V6MycsICdhcHBsaWNhdGlvbi92bmQuZXpwaXgtcGFja2FnZSddLFxuICAgIFsnZicsICd0ZXh0L3gtZm9ydHJhbiddLFxuICAgIFsnZjR2JywgJ3ZpZGVvL21wNCddLFxuICAgIFsnZjc3JywgJ3RleHQveC1mb3J0cmFuJ10sXG4gICAgWydmOTAnLCAndGV4dC94LWZvcnRyYW4nXSxcbiAgICBbJ2ZicycsICdpbWFnZS92bmQuZmFzdGJpZHNoZWV0J10sXG4gICAgWydmY2R0JywgJ2FwcGxpY2F0aW9uL3ZuZC5hZG9iZS5mb3Jtc2NlbnRyYWwuZmNkdCddLFxuICAgIFsnZmNzJywgJ2FwcGxpY2F0aW9uL3ZuZC5pc2FjLmZjcyddLFxuICAgIFsnZmRmJywgJ2FwcGxpY2F0aW9uL3ZuZC5mZGYnXSxcbiAgICBbJ2ZkdCcsICdhcHBsaWNhdGlvbi9mZHQreG1sJ10sXG4gICAgWydmZV9sYXVuY2gnLCAnYXBwbGljYXRpb24vdm5kLmRlbm92by5mY3NlbGF5b3V0LWxpbmsnXSxcbiAgICBbJ2ZnNScsICdhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c2dwJ10sXG4gICAgWydmZ2QnLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnZmgnLCAnaW1hZ2UveC1mcmVlaGFuZCddLFxuICAgIFsnZmg0JywgJ2ltYWdlL3gtZnJlZWhhbmQnXSxcbiAgICBbJ2ZoNScsICdpbWFnZS94LWZyZWVoYW5kJ10sXG4gICAgWydmaDcnLCAnaW1hZ2UveC1mcmVlaGFuZCddLFxuICAgIFsnZmhjJywgJ2ltYWdlL3gtZnJlZWhhbmQnXSxcbiAgICBbJ2ZpZycsICdhcHBsaWNhdGlvbi94LXhmaWcnXSxcbiAgICBbJ2ZpdHMnLCAnaW1hZ2UvZml0cyddLFxuICAgIFsnZmxhYycsICdhdWRpby94LWZsYWMnXSxcbiAgICBbJ2ZsaScsICd2aWRlby94LWZsaSddLFxuICAgIFsnZmxvJywgJ2FwcGxpY2F0aW9uL3ZuZC5taWNyb2dyYWZ4LmZsbyddLFxuICAgIFsnZmx2JywgJ3ZpZGVvL3gtZmx2J10sXG4gICAgWydmbHcnLCAnYXBwbGljYXRpb24vdm5kLmtkZS5raXZpbyddLFxuICAgIFsnZmx4JywgJ3RleHQvdm5kLmZtaS5mbGV4c3RvciddLFxuICAgIFsnZmx5JywgJ3RleHQvdm5kLmZseSddLFxuICAgIFsnZm0nLCAnYXBwbGljYXRpb24vdm5kLmZyYW1lbWFrZXInXSxcbiAgICBbJ2ZuYycsICdhcHBsaWNhdGlvbi92bmQuZnJvZ2Fucy5mbmMnXSxcbiAgICBbJ2ZvJywgJ2FwcGxpY2F0aW9uL3ZuZC5zb2Z0d2FyZTYwMi5maWxsZXIuZm9ybSt4bWwnXSxcbiAgICBbJ2ZvcicsICd0ZXh0L3gtZm9ydHJhbiddLFxuICAgIFsnZnB4JywgJ2ltYWdlL3ZuZC5mcHgnXSxcbiAgICBbJ2ZyYW1lJywgJ2FwcGxpY2F0aW9uL3ZuZC5mcmFtZW1ha2VyJ10sXG4gICAgWydmc2MnLCAnYXBwbGljYXRpb24vdm5kLmZzYy53ZWJsYXVuY2gnXSxcbiAgICBbJ2ZzdCcsICdpbWFnZS92bmQuZnN0J10sXG4gICAgWydmdGMnLCAnYXBwbGljYXRpb24vdm5kLmZsdXh0aW1lLmNsaXAnXSxcbiAgICBbJ2Z0aScsICdhcHBsaWNhdGlvbi92bmQuYW5zZXItd2ViLWZ1bmRzLXRyYW5zZmVyLWluaXRpYXRpb24nXSxcbiAgICBbJ2Z2dCcsICd2aWRlby92bmQuZnZ0J10sXG4gICAgWydmeHAnLCAnYXBwbGljYXRpb24vdm5kLmFkb2JlLmZ4cCddLFxuICAgIFsnZnhwbCcsICdhcHBsaWNhdGlvbi92bmQuYWRvYmUuZnhwJ10sXG4gICAgWydmenMnLCAnYXBwbGljYXRpb24vdm5kLmZ1enp5c2hlZXQnXSxcbiAgICBbJ2cydycsICdhcHBsaWNhdGlvbi92bmQuZ2VvcGxhbiddLFxuICAgIFsnZzMnLCAnaW1hZ2UvZzNmYXgnXSxcbiAgICBbJ2czdycsICdhcHBsaWNhdGlvbi92bmQuZ2Vvc3BhY2UnXSxcbiAgICBbJ2dhYycsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWFjY291bnQnXSxcbiAgICBbJ2dhbScsICdhcHBsaWNhdGlvbi94LXRhZHMnXSxcbiAgICBbJ2dicicsICdhcHBsaWNhdGlvbi9ycGtpLWdob3N0YnVzdGVycyddLFxuICAgIFsnZ2NhJywgJ2FwcGxpY2F0aW9uL3gtZ2NhLWNvbXByZXNzZWQnXSxcbiAgICBbJ2dkbCcsICdtb2RlbC92bmQuZ2RsJ10sXG4gICAgWydnZG9jJywgJ2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtYXBwcy5kb2N1bWVudCddLFxuICAgIFsnZ2VvJywgJ2FwcGxpY2F0aW9uL3ZuZC5keW5hZ2VvJ10sXG4gICAgWydnZW9qc29uJywgJ2FwcGxpY2F0aW9uL2dlbytqc29uJ10sXG4gICAgWydnZXgnLCAnYXBwbGljYXRpb24vdm5kLmdlb21ldHJ5LWV4cGxvcmVyJ10sXG4gICAgWydnZ2InLCAnYXBwbGljYXRpb24vdm5kLmdlb2dlYnJhLmZpbGUnXSxcbiAgICBbJ2dndCcsICdhcHBsaWNhdGlvbi92bmQuZ2VvZ2VicmEudG9vbCddLFxuICAgIFsnZ2hmJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaGVscCddLFxuICAgIFsnZ2lmJywgJ2ltYWdlL2dpZiddLFxuICAgIFsnZ2ltJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaWRlbnRpdHktbWVzc2FnZSddLFxuICAgIFsnZ2xiJywgJ21vZGVsL2dsdGYtYmluYXJ5J10sXG4gICAgWydnbHRmJywgJ21vZGVsL2dsdGYranNvbiddLFxuICAgIFsnZ21sJywgJ2FwcGxpY2F0aW9uL2dtbCt4bWwnXSxcbiAgICBbJ2dteCcsICdhcHBsaWNhdGlvbi92bmQuZ214J10sXG4gICAgWydnbnVtZXJpYycsICdhcHBsaWNhdGlvbi94LWdudW1lcmljJ10sXG4gICAgWydncGcnLCAnYXBwbGljYXRpb24vZ3BnLWtleXMnXSxcbiAgICBbJ2dwaCcsICdhcHBsaWNhdGlvbi92bmQuZmxvZ3JhcGhpdCddLFxuICAgIFsnZ3B4JywgJ2FwcGxpY2F0aW9uL2dweCt4bWwnXSxcbiAgICBbJ2dxZicsICdhcHBsaWNhdGlvbi92bmQuZ3JhZmVxJ10sXG4gICAgWydncXMnLCAnYXBwbGljYXRpb24vdm5kLmdyYWZlcSddLFxuICAgIFsnZ3JhbScsICdhcHBsaWNhdGlvbi9zcmdzJ10sXG4gICAgWydncmFtcHMnLCAnYXBwbGljYXRpb24veC1ncmFtcHMteG1sJ10sXG4gICAgWydncmUnLCAnYXBwbGljYXRpb24vdm5kLmdlb21ldHJ5LWV4cGxvcmVyJ10sXG4gICAgWydncnYnLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS1pbmplY3RvciddLFxuICAgIFsnZ3J4bWwnLCAnYXBwbGljYXRpb24vc3Jncyt4bWwnXSxcbiAgICBbJ2dzZicsICdhcHBsaWNhdGlvbi94LWZvbnQtZ2hvc3RzY3JpcHQnXSxcbiAgICBbJ2dzaGVldCcsICdhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMuc3ByZWFkc2hlZXQnXSxcbiAgICBbJ2dzbGlkZXMnLCAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLnByZXNlbnRhdGlvbiddLFxuICAgIFsnZ3RhcicsICdhcHBsaWNhdGlvbi94LWd0YXInXSxcbiAgICBbJ2d0bScsICdhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXRvb2wtbWVzc2FnZSddLFxuICAgIFsnZ3R3JywgJ21vZGVsL3ZuZC5ndHcnXSxcbiAgICBbJ2d2JywgJ3RleHQvdm5kLmdyYXBodml6J10sXG4gICAgWydneGYnLCAnYXBwbGljYXRpb24vZ3hmJ10sXG4gICAgWydneHQnLCAnYXBwbGljYXRpb24vdm5kLmdlb25leHQnXSxcbiAgICBbJ2d6JywgJ2FwcGxpY2F0aW9uL2d6aXAnXSxcbiAgICBbJ2d6aXAnLCAnYXBwbGljYXRpb24vZ3ppcCddLFxuICAgIFsnaCcsICd0ZXh0L3gtYyddLFxuICAgIFsnaDI2MScsICd2aWRlby9oMjYxJ10sXG4gICAgWydoMjYzJywgJ3ZpZGVvL2gyNjMnXSxcbiAgICBbJ2gyNjQnLCAndmlkZW8vaDI2NCddLFxuICAgIFsnaGFsJywgJ2FwcGxpY2F0aW9uL3ZuZC5oYWwreG1sJ10sXG4gICAgWydoYmNpJywgJ2FwcGxpY2F0aW9uL3ZuZC5oYmNpJ10sXG4gICAgWydoYnMnLCAndGV4dC94LWhhbmRsZWJhcnMtdGVtcGxhdGUnXSxcbiAgICBbJ2hkZCcsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtaGRkJ10sXG4gICAgWydoZGYnLCAnYXBwbGljYXRpb24veC1oZGYnXSxcbiAgICBbJ2hlaWMnLCAnaW1hZ2UvaGVpYyddLFxuICAgIFsnaGVpY3MnLCAnaW1hZ2UvaGVpYy1zZXF1ZW5jZSddLFxuICAgIFsnaGVpZicsICdpbWFnZS9oZWlmJ10sXG4gICAgWydoZWlmcycsICdpbWFnZS9oZWlmLXNlcXVlbmNlJ10sXG4gICAgWydoZWoyJywgJ2ltYWdlL2hlajJrJ10sXG4gICAgWydoZWxkJywgJ2FwcGxpY2F0aW9uL2F0c2MtaGVsZCt4bWwnXSxcbiAgICBbJ2hoJywgJ3RleHQveC1jJ10sXG4gICAgWydoanNvbicsICdhcHBsaWNhdGlvbi9oanNvbiddLFxuICAgIFsnaGxwJywgJ2FwcGxpY2F0aW9uL3dpbmhscCddLFxuICAgIFsnaHBnbCcsICdhcHBsaWNhdGlvbi92bmQuaHAtaHBnbCddLFxuICAgIFsnaHBpZCcsICdhcHBsaWNhdGlvbi92bmQuaHAtaHBpZCddLFxuICAgIFsnaHBzJywgJ2FwcGxpY2F0aW9uL3ZuZC5ocC1ocHMnXSxcbiAgICBbJ2hxeCcsICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnXSxcbiAgICBbJ2hzajInLCAnaW1hZ2UvaHNqMiddLFxuICAgIFsnaHRjJywgJ3RleHQveC1jb21wb25lbnQnXSxcbiAgICBbJ2h0a2UnLCAnYXBwbGljYXRpb24vdm5kLmtlbmFtZWFhcHAnXSxcbiAgICBbJ2h0bScsICd0ZXh0L2h0bWwnXSxcbiAgICBbJ2h0bWwnLCAndGV4dC9odG1sJ10sXG4gICAgWydodmQnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi1kaWMnXSxcbiAgICBbJ2h2cCcsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LXZvaWNlJ10sXG4gICAgWydodnMnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi1zY3JpcHQnXSxcbiAgICBbJ2kyZycsICdhcHBsaWNhdGlvbi92bmQuaW50ZXJnZW8nXSxcbiAgICBbJ2ljYycsICdhcHBsaWNhdGlvbi92bmQuaWNjcHJvZmlsZSddLFxuICAgIFsnaWNlJywgJ3gtY29uZmVyZW5jZS94LWNvb2x0YWxrJ10sXG4gICAgWydpY20nLCAnYXBwbGljYXRpb24vdm5kLmljY3Byb2ZpbGUnXSxcbiAgICBbJ2ljbycsICdpbWFnZS94LWljb24nXSxcbiAgICBbJ2ljcycsICd0ZXh0L2NhbGVuZGFyJ10sXG4gICAgWydpZWYnLCAnaW1hZ2UvaWVmJ10sXG4gICAgWydpZmInLCAndGV4dC9jYWxlbmRhciddLFxuICAgIFsnaWZtJywgJ2FwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5mb3JtZGF0YSddLFxuICAgIFsnaWdlcycsICdtb2RlbC9pZ2VzJ10sXG4gICAgWydpZ2wnLCAnYXBwbGljYXRpb24vdm5kLmlnbG9hZGVyJ10sXG4gICAgWydpZ20nLCAnYXBwbGljYXRpb24vdm5kLmluc29ycy5pZ20nXSxcbiAgICBbJ2lncycsICdtb2RlbC9pZ2VzJ10sXG4gICAgWydpZ3gnLCAnYXBwbGljYXRpb24vdm5kLm1pY3JvZ3JhZnguaWd4J10sXG4gICAgWydpaWYnLCAnYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmludGVyY2hhbmdlJ10sXG4gICAgWydpbWcnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydpbXAnLCAnYXBwbGljYXRpb24vdm5kLmFjY3BhYy5zaW1wbHkuaW1wJ10sXG4gICAgWydpbXMnLCAnYXBwbGljYXRpb24vdm5kLm1zLWltcyddLFxuICAgIFsnaW4nLCAndGV4dC9wbGFpbiddLFxuICAgIFsnaW5pJywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ2luaycsICdhcHBsaWNhdGlvbi9pbmttbCt4bWwnXSxcbiAgICBbJ2lua21sJywgJ2FwcGxpY2F0aW9uL2lua21sK3htbCddLFxuICAgIFsnaW5zdGFsbCcsICdhcHBsaWNhdGlvbi94LWluc3RhbGwtaW5zdHJ1Y3Rpb25zJ10sXG4gICAgWydpb3RhJywgJ2FwcGxpY2F0aW9uL3ZuZC5hc3RyYWVhLXNvZnR3YXJlLmlvdGEnXSxcbiAgICBbJ2lwZml4JywgJ2FwcGxpY2F0aW9uL2lwZml4J10sXG4gICAgWydpcGsnLCAnYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLnBhY2thZ2UnXSxcbiAgICBbJ2lybScsICdhcHBsaWNhdGlvbi92bmQuaWJtLnJpZ2h0cy1tYW5hZ2VtZW50J10sXG4gICAgWydpcnAnLCAnYXBwbGljYXRpb24vdm5kLmlyZXBvc2l0b3J5LnBhY2thZ2UreG1sJ10sXG4gICAgWydpc28nLCAnYXBwbGljYXRpb24veC1pc285NjYwLWltYWdlJ10sXG4gICAgWydpdHAnLCAnYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmZvcm10ZW1wbGF0ZSddLFxuICAgIFsnaXRzJywgJ2FwcGxpY2F0aW9uL2l0cyt4bWwnXSxcbiAgICBbJ2l2cCcsICdhcHBsaWNhdGlvbi92bmQuaW1tZXJ2aXNpb24taXZwJ10sXG4gICAgWydpdnUnLCAnYXBwbGljYXRpb24vdm5kLmltbWVydmlzaW9uLWl2dSddLFxuICAgIFsnamFkJywgJ3RleHQvdm5kLnN1bi5qMm1lLmFwcC1kZXNjcmlwdG9yJ10sXG4gICAgWydqYWRlJywgJ3RleHQvamFkZSddLFxuICAgIFsnamFtJywgJ2FwcGxpY2F0aW9uL3ZuZC5qYW0nXSxcbiAgICBbJ2phcicsICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnXSxcbiAgICBbJ2phcmRpZmYnLCAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUtZGlmZiddLFxuICAgIFsnamF2YScsICd0ZXh0L3gtamF2YS1zb3VyY2UnXSxcbiAgICBbJ2poYycsICdpbWFnZS9qcGhjJ10sXG4gICAgWydqaXNwJywgJ2FwcGxpY2F0aW9uL3ZuZC5qaXNwJ10sXG4gICAgWydqbHMnLCAnaW1hZ2UvamxzJ10sXG4gICAgWydqbHQnLCAnYXBwbGljYXRpb24vdm5kLmhwLWpseXQnXSxcbiAgICBbJ2puZycsICdpbWFnZS94LWpuZyddLFxuICAgIFsnam5scCcsICdhcHBsaWNhdGlvbi94LWphdmEtam5scC1maWxlJ10sXG4gICAgWydqb2RhJywgJ2FwcGxpY2F0aW9uL3ZuZC5qb29zdC5qb2RhLWFyY2hpdmUnXSxcbiAgICBbJ2pwMicsICdpbWFnZS9qcDInXSxcbiAgICBbJ2pwZScsICdpbWFnZS9qcGVnJ10sXG4gICAgWydqcGVnJywgJ2ltYWdlL2pwZWcnXSxcbiAgICBbJ2pwZicsICdpbWFnZS9qcHgnXSxcbiAgICBbJ2pwZycsICdpbWFnZS9qcGVnJ10sXG4gICAgWydqcGcyJywgJ2ltYWdlL2pwMiddLFxuICAgIFsnanBnbScsICd2aWRlby9qcG0nXSxcbiAgICBbJ2pwZ3YnLCAndmlkZW8vanBlZyddLFxuICAgIFsnanBoJywgJ2ltYWdlL2pwaCddLFxuICAgIFsnanBtJywgJ3ZpZGVvL2pwbSddLFxuICAgIFsnanB4JywgJ2ltYWdlL2pweCddLFxuICAgIFsnanMnLCAnYXBwbGljYXRpb24vamF2YXNjcmlwdCddLFxuICAgIFsnanNvbicsICdhcHBsaWNhdGlvbi9qc29uJ10sXG4gICAgWydqc29uNScsICdhcHBsaWNhdGlvbi9qc29uNSddLFxuICAgIFsnanNvbmxkJywgJ2FwcGxpY2F0aW9uL2xkK2pzb24nXSxcbiAgICAvLyBodHRwczovL2pzb25saW5lcy5vcmcvXG4gICAgWydqc29ubCcsICdhcHBsaWNhdGlvbi9qc29ubCddLFxuICAgIFsnanNvbm1sJywgJ2FwcGxpY2F0aW9uL2pzb25tbCtqc29uJ10sXG4gICAgWydqc3gnLCAndGV4dC9qc3gnXSxcbiAgICBbJ2p4cicsICdpbWFnZS9qeHInXSxcbiAgICBbJ2p4cmEnLCAnaW1hZ2UvanhyYSddLFxuICAgIFsnanhycycsICdpbWFnZS9qeHJzJ10sXG4gICAgWydqeHMnLCAnaW1hZ2UvanhzJ10sXG4gICAgWydqeHNjJywgJ2ltYWdlL2p4c2MnXSxcbiAgICBbJ2p4c2knLCAnaW1hZ2UvanhzaSddLFxuICAgIFsnanhzcycsICdpbWFnZS9qeHNzJ10sXG4gICAgWydrYXInLCAnYXVkaW8vbWlkaSddLFxuICAgIFsna2FyYm9uJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua2FyYm9uJ10sXG4gICAgWydrZGInLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydrZGJ4JywgJ2FwcGxpY2F0aW9uL3gta2VlcGFzczInXSxcbiAgICBbJ2tleScsICdhcHBsaWNhdGlvbi94LWl3b3JrLWtleW5vdGUtc2Zma2V5J10sXG4gICAgWydrZm8nLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rZm9ybXVsYSddLFxuICAgIFsna2lhJywgJ2FwcGxpY2F0aW9uL3ZuZC5raWRzcGlyYXRpb24nXSxcbiAgICBbJ2ttbCcsICdhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmttbCt4bWwnXSxcbiAgICBbJ2tteicsICdhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmtteiddLFxuICAgIFsna25lJywgJ2FwcGxpY2F0aW9uL3ZuZC5raW5hciddLFxuICAgIFsna25wJywgJ2FwcGxpY2F0aW9uL3ZuZC5raW5hciddLFxuICAgIFsna29uJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua29udG91ciddLFxuICAgIFsna3ByJywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua3ByZXNlbnRlciddLFxuICAgIFsna3B0JywgJ2FwcGxpY2F0aW9uL3ZuZC5rZGUua3ByZXNlbnRlciddLFxuICAgIFsna3B4eCcsICdhcHBsaWNhdGlvbi92bmQuZHMta2V5cG9pbnQnXSxcbiAgICBbJ2tzcCcsICdhcHBsaWNhdGlvbi92bmQua2RlLmtzcHJlYWQnXSxcbiAgICBbJ2t0cicsICdhcHBsaWNhdGlvbi92bmQua2Fob290eiddLFxuICAgIFsna3R4JywgJ2ltYWdlL2t0eCddLFxuICAgIFsna3R4MicsICdpbWFnZS9rdHgyJ10sXG4gICAgWydrdHonLCAnYXBwbGljYXRpb24vdm5kLmthaG9vdHonXSxcbiAgICBbJ2t3ZCcsICdhcHBsaWNhdGlvbi92bmQua2RlLmt3b3JkJ10sXG4gICAgWydrd3QnLCAnYXBwbGljYXRpb24vdm5kLmtkZS5rd29yZCddLFxuICAgIFsnbGFzeG1sJywgJ2FwcGxpY2F0aW9uL3ZuZC5sYXMubGFzK3htbCddLFxuICAgIFsnbGF0ZXgnLCAnYXBwbGljYXRpb24veC1sYXRleCddLFxuICAgIFsnbGJkJywgJ2FwcGxpY2F0aW9uL3ZuZC5sbGFtYWdyYXBoaWNzLmxpZmUtYmFsYW5jZS5kZXNrdG9wJ10sXG4gICAgWydsYmUnLCAnYXBwbGljYXRpb24vdm5kLmxsYW1hZ3JhcGhpY3MubGlmZS1iYWxhbmNlLmV4Y2hhbmdlK3htbCddLFxuICAgIFsnbGVzJywgJ2FwcGxpY2F0aW9uL3ZuZC5oaGUubGVzc29uLXBsYXllciddLFxuICAgIFsnbGVzcycsICd0ZXh0L2xlc3MnXSxcbiAgICBbJ2xncicsICdhcHBsaWNhdGlvbi9sZ3IreG1sJ10sXG4gICAgWydsaGEnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydsaW5rNjYnLCAnYXBwbGljYXRpb24vdm5kLnJvdXRlNjYubGluazY2K3htbCddLFxuICAgIFsnbGlzdCcsICd0ZXh0L3BsYWluJ10sXG4gICAgWydsaXN0MzgyMCcsICdhcHBsaWNhdGlvbi92bmQuaWJtLm1vZGNhcCddLFxuICAgIFsnbGlzdGFmcCcsICdhcHBsaWNhdGlvbi92bmQuaWJtLm1vZGNhcCddLFxuICAgIFsnbGl0Y29mZmVlJywgJ3RleHQvY29mZmVlc2NyaXB0J10sXG4gICAgWydsbmsnLCAnYXBwbGljYXRpb24veC1tcy1zaG9ydGN1dCddLFxuICAgIFsnbG9nJywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ2xvc3R4bWwnLCAnYXBwbGljYXRpb24vbG9zdCt4bWwnXSxcbiAgICBbJ2xyZicsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ2xybScsICdhcHBsaWNhdGlvbi92bmQubXMtbHJtJ10sXG4gICAgWydsdGYnLCAnYXBwbGljYXRpb24vdm5kLmZyb2dhbnMubHRmJ10sXG4gICAgWydsdWEnLCAndGV4dC94LWx1YSddLFxuICAgIFsnbHVhYycsICdhcHBsaWNhdGlvbi94LWx1YS1ieXRlY29kZSddLFxuICAgIFsnbHZwJywgJ2F1ZGlvL3ZuZC5sdWNlbnQudm9pY2UnXSxcbiAgICBbJ2x3cCcsICdhcHBsaWNhdGlvbi92bmQubG90dXMtd29yZHBybyddLFxuICAgIFsnbHpoJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnbTF2JywgJ3ZpZGVvL21wZWcnXSxcbiAgICBbJ20yYScsICdhdWRpby9tcGVnJ10sXG4gICAgWydtMnYnLCAndmlkZW8vbXBlZyddLFxuICAgIFsnbTNhJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ20zdScsICd0ZXh0L3BsYWluJ10sXG4gICAgWydtM3U4JywgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5tcGVndXJsJ10sXG4gICAgWydtNGEnLCAnYXVkaW8veC1tNGEnXSxcbiAgICBbJ200cCcsICdhcHBsaWNhdGlvbi9tcDQnXSxcbiAgICBbJ200cycsICd2aWRlby9pc28uc2VnbWVudCddLFxuICAgIFsnbTR1JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcGVndXJsJ10sXG4gICAgWydtNHYnLCAndmlkZW8veC1tNHYnXSxcbiAgICBbJ20xMycsICdhcHBsaWNhdGlvbi94LW1zbWVkaWF2aWV3J10sXG4gICAgWydtMTQnLCAnYXBwbGljYXRpb24veC1tc21lZGlhdmlldyddLFxuICAgIFsnbTIxJywgJ2FwcGxpY2F0aW9uL21wMjEnXSxcbiAgICBbJ21hJywgJ2FwcGxpY2F0aW9uL21hdGhlbWF0aWNhJ10sXG4gICAgWydtYWRzJywgJ2FwcGxpY2F0aW9uL21hZHMreG1sJ10sXG4gICAgWydtYWVpJywgJ2FwcGxpY2F0aW9uL21tdC1hZWkreG1sJ10sXG4gICAgWydtYWcnLCAnYXBwbGljYXRpb24vdm5kLmVjb3dpbi5jaGFydCddLFxuICAgIFsnbWFrZXInLCAnYXBwbGljYXRpb24vdm5kLmZyYW1lbWFrZXInXSxcbiAgICBbJ21hbicsICd0ZXh0L3Ryb2ZmJ10sXG4gICAgWydtYW5pZmVzdCcsICd0ZXh0L2NhY2hlLW1hbmlmZXN0J10sXG4gICAgWydtYXAnLCAnYXBwbGljYXRpb24vanNvbiddLFxuICAgIFsnbWFyJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnbWFya2Rvd24nLCAndGV4dC9tYXJrZG93biddLFxuICAgIFsnbWF0aG1sJywgJ2FwcGxpY2F0aW9uL21hdGhtbCt4bWwnXSxcbiAgICBbJ21iJywgJ2FwcGxpY2F0aW9uL21hdGhlbWF0aWNhJ10sXG4gICAgWydtYmsnLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy5tYmsnXSxcbiAgICBbJ21ib3gnLCAnYXBwbGljYXRpb24vbWJveCddLFxuICAgIFsnbWMxJywgJ2FwcGxpY2F0aW9uL3ZuZC5tZWRjYWxjZGF0YSddLFxuICAgIFsnbWNkJywgJ2FwcGxpY2F0aW9uL3ZuZC5tY2QnXSxcbiAgICBbJ21jdXJsJywgJ3RleHQvdm5kLmN1cmwubWN1cmwnXSxcbiAgICBbJ21kJywgJ3RleHQvbWFya2Rvd24nXSxcbiAgICBbJ21kYicsICdhcHBsaWNhdGlvbi94LW1zYWNjZXNzJ10sXG4gICAgWydtZGknLCAnaW1hZ2Uvdm5kLm1zLW1vZGknXSxcbiAgICBbJ21keCcsICd0ZXh0L21keCddLFxuICAgIFsnbWUnLCAndGV4dC90cm9mZiddLFxuICAgIFsnbWVzaCcsICdtb2RlbC9tZXNoJ10sXG4gICAgWydtZXRhNCcsICdhcHBsaWNhdGlvbi9tZXRhbGluazQreG1sJ10sXG4gICAgWydtZXRhbGluaycsICdhcHBsaWNhdGlvbi9tZXRhbGluayt4bWwnXSxcbiAgICBbJ21ldHMnLCAnYXBwbGljYXRpb24vbWV0cyt4bWwnXSxcbiAgICBbJ21mbScsICdhcHBsaWNhdGlvbi92bmQubWZtcCddLFxuICAgIFsnbWZ0JywgJ2FwcGxpY2F0aW9uL3Jwa2ktbWFuaWZlc3QnXSxcbiAgICBbJ21ncCcsICdhcHBsaWNhdGlvbi92bmQub3NnZW8ubWFwZ3VpZGUucGFja2FnZSddLFxuICAgIFsnbWd6JywgJ2FwcGxpY2F0aW9uL3ZuZC5wcm90ZXVzLm1hZ2F6aW5lJ10sXG4gICAgWydtaWQnLCAnYXVkaW8vbWlkaSddLFxuICAgIFsnbWlkaScsICdhdWRpby9taWRpJ10sXG4gICAgWydtaWUnLCAnYXBwbGljYXRpb24veC1taWUnXSxcbiAgICBbJ21pZicsICdhcHBsaWNhdGlvbi92bmQubWlmJ10sXG4gICAgWydtaW1lJywgJ21lc3NhZ2UvcmZjODIyJ10sXG4gICAgWydtajInLCAndmlkZW8vbWoyJ10sXG4gICAgWydtanAyJywgJ3ZpZGVvL21qMiddLFxuICAgIFsnbWpzJywgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnXSxcbiAgICBbJ21rM2QnLCAndmlkZW8veC1tYXRyb3NrYSddLFxuICAgIFsnbWthJywgJ2F1ZGlvL3gtbWF0cm9za2EnXSxcbiAgICBbJ21rZCcsICd0ZXh0L3gtbWFya2Rvd24nXSxcbiAgICBbJ21rcycsICd2aWRlby94LW1hdHJvc2thJ10sXG4gICAgWydta3YnLCAndmlkZW8veC1tYXRyb3NrYSddLFxuICAgIFsnbWxwJywgJ2FwcGxpY2F0aW9uL3ZuZC5kb2xieS5tbHAnXSxcbiAgICBbJ21tZCcsICdhcHBsaWNhdGlvbi92bmQuY2hpcG51dHMua2FyYW9rZS1tbWQnXSxcbiAgICBbJ21tZicsICdhcHBsaWNhdGlvbi92bmQuc21hZiddLFxuICAgIFsnbW1sJywgJ3RleHQvbWF0aG1sJ10sXG4gICAgWydtbXInLCAnaW1hZ2Uvdm5kLmZ1aml4ZXJveC5lZG1pY3MtbW1yJ10sXG4gICAgWydtbmcnLCAndmlkZW8veC1tbmcnXSxcbiAgICBbJ21ueScsICdhcHBsaWNhdGlvbi94LW1zbW9uZXknXSxcbiAgICBbJ21vYmknLCAnYXBwbGljYXRpb24veC1tb2JpcG9ja2V0LWVib29rJ10sXG4gICAgWydtb2RzJywgJ2FwcGxpY2F0aW9uL21vZHMreG1sJ10sXG4gICAgWydtb3YnLCAndmlkZW8vcXVpY2t0aW1lJ10sXG4gICAgWydtb3ZpZScsICd2aWRlby94LXNnaS1tb3ZpZSddLFxuICAgIFsnbXAyJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ21wMmEnLCAnYXVkaW8vbXBlZyddLFxuICAgIFsnbXAzJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ21wNCcsICd2aWRlby9tcDQnXSxcbiAgICBbJ21wNGEnLCAnYXVkaW8vbXA0J10sXG4gICAgWydtcDRzJywgJ2FwcGxpY2F0aW9uL21wNCddLFxuICAgIFsnbXA0dicsICd2aWRlby9tcDQnXSxcbiAgICBbJ21wMjEnLCAnYXBwbGljYXRpb24vbXAyMSddLFxuICAgIFsnbXBjJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb3BodW4uY2VydGlmaWNhdGUnXSxcbiAgICBbJ21wZCcsICdhcHBsaWNhdGlvbi9kYXNoK3htbCddLFxuICAgIFsnbXBlJywgJ3ZpZGVvL21wZWcnXSxcbiAgICBbJ21wZWcnLCAndmlkZW8vbXBlZyddLFxuICAgIFsnbXBnJywgJ3ZpZGVvL21wZWcnXSxcbiAgICBbJ21wZzQnLCAndmlkZW8vbXA0J10sXG4gICAgWydtcGdhJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ21wa2cnLCAnYXBwbGljYXRpb24vdm5kLmFwcGxlLmluc3RhbGxlcit4bWwnXSxcbiAgICBbJ21wbScsICdhcHBsaWNhdGlvbi92bmQuYmx1ZWljZS5tdWx0aXBhc3MnXSxcbiAgICBbJ21wbicsICdhcHBsaWNhdGlvbi92bmQubW9waHVuLmFwcGxpY2F0aW9uJ10sXG4gICAgWydtcHAnLCAnYXBwbGljYXRpb24vdm5kLm1zLXByb2plY3QnXSxcbiAgICBbJ21wdCcsICdhcHBsaWNhdGlvbi92bmQubXMtcHJvamVjdCddLFxuICAgIFsnbXB5JywgJ2FwcGxpY2F0aW9uL3ZuZC5pYm0ubWluaXBheSddLFxuICAgIFsnbXF5JywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubXF5J10sXG4gICAgWydtcmMnLCAnYXBwbGljYXRpb24vbWFyYyddLFxuICAgIFsnbXJjeCcsICdhcHBsaWNhdGlvbi9tYXJjeG1sK3htbCddLFxuICAgIFsnbXMnLCAndGV4dC90cm9mZiddLFxuICAgIFsnbXNjbWwnLCAnYXBwbGljYXRpb24vbWVkaWFzZXJ2ZXJjb250cm9sK3htbCddLFxuICAgIFsnbXNlZWQnLCAnYXBwbGljYXRpb24vdm5kLmZkc24ubXNlZWQnXSxcbiAgICBbJ21zZXEnLCAnYXBwbGljYXRpb24vdm5kLm1zZXEnXSxcbiAgICBbJ21zZicsICdhcHBsaWNhdGlvbi92bmQuZXBzb24ubXNmJ10sXG4gICAgWydtc2cnLCAnYXBwbGljYXRpb24vdm5kLm1zLW91dGxvb2snXSxcbiAgICBbJ21zaCcsICdtb2RlbC9tZXNoJ10sXG4gICAgWydtc2knLCAnYXBwbGljYXRpb24veC1tc2Rvd25sb2FkJ10sXG4gICAgWydtc2wnLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy5tc2wnXSxcbiAgICBbJ21zbScsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ21zcCcsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ21zdHknLCAnYXBwbGljYXRpb24vdm5kLm11dmVlLnN0eWxlJ10sXG4gICAgWydtdGwnLCAnbW9kZWwvbXRsJ10sXG4gICAgWydtdHMnLCAnbW9kZWwvdm5kLm10cyddLFxuICAgIFsnbXVzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tdXNpY2lhbiddLFxuICAgIFsnbXVzZCcsICdhcHBsaWNhdGlvbi9tbXQtdXNkK3htbCddLFxuICAgIFsnbXVzaWN4bWwnLCAnYXBwbGljYXRpb24vdm5kLnJlY29yZGFyZS5tdXNpY3htbCt4bWwnXSxcbiAgICBbJ212YicsICdhcHBsaWNhdGlvbi94LW1zbWVkaWF2aWV3J10sXG4gICAgWydtdnQnLCAnYXBwbGljYXRpb24vdm5kLm1hcGJveC12ZWN0b3ItdGlsZSddLFxuICAgIFsnbXdmJywgJ2FwcGxpY2F0aW9uL3ZuZC5tZmVyJ10sXG4gICAgWydteGYnLCAnYXBwbGljYXRpb24vbXhmJ10sXG4gICAgWydteGwnLCAnYXBwbGljYXRpb24vdm5kLnJlY29yZGFyZS5tdXNpY3htbCddLFxuICAgIFsnbXhtZicsICdhdWRpby9tb2JpbGUteG1mJ10sXG4gICAgWydteG1sJywgJ2FwcGxpY2F0aW9uL3h2K3htbCddLFxuICAgIFsnbXhzJywgJ2FwcGxpY2F0aW9uL3ZuZC50cmlzY2FwZS5teHMnXSxcbiAgICBbJ214dScsICd2aWRlby92bmQubXBlZ3VybCddLFxuICAgIFsnbi1nYWdlJywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2Uuc3ltYmlhbi5pbnN0YWxsJ10sXG4gICAgWyduMycsICd0ZXh0L24zJ10sXG4gICAgWyduYicsICdhcHBsaWNhdGlvbi9tYXRoZW1hdGljYSddLFxuICAgIFsnbmJwJywgJ2FwcGxpY2F0aW9uL3ZuZC53b2xmcmFtLnBsYXllciddLFxuICAgIFsnbmMnLCAnYXBwbGljYXRpb24veC1uZXRjZGYnXSxcbiAgICBbJ25jeCcsICdhcHBsaWNhdGlvbi94LWR0Ym5jeCt4bWwnXSxcbiAgICBbJ25mbycsICd0ZXh0L3gtbmZvJ10sXG4gICAgWyduZ2RhdCcsICdhcHBsaWNhdGlvbi92bmQubm9raWEubi1nYWdlLmRhdGEnXSxcbiAgICBbJ25pdGYnLCAnYXBwbGljYXRpb24vdm5kLm5pdGYnXSxcbiAgICBbJ25sdScsICdhcHBsaWNhdGlvbi92bmQubmV1cm9sYW5ndWFnZS5ubHUnXSxcbiAgICBbJ25tbCcsICdhcHBsaWNhdGlvbi92bmQuZW5saXZlbiddLFxuICAgIFsnbm5kJywgJ2FwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC1kaXJlY3RvcnknXSxcbiAgICBbJ25ucycsICdhcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtc2VhbGVyJ10sXG4gICAgWydubncnLCAnYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LXdlYiddLFxuICAgIFsnbnB4JywgJ2ltYWdlL3ZuZC5uZXQtZnB4J10sXG4gICAgWyducScsICdhcHBsaWNhdGlvbi9uLXF1YWRzJ10sXG4gICAgWyduc2MnLCAnYXBwbGljYXRpb24veC1jb25mZXJlbmNlJ10sXG4gICAgWyduc2YnLCAnYXBwbGljYXRpb24vdm5kLmxvdHVzLW5vdGVzJ10sXG4gICAgWydudCcsICdhcHBsaWNhdGlvbi9uLXRyaXBsZXMnXSxcbiAgICBbJ250ZicsICdhcHBsaWNhdGlvbi92bmQubml0ZiddLFxuICAgIFsnbnVtYmVycycsICdhcHBsaWNhdGlvbi94LWl3b3JrLW51bWJlcnMtc2ZmbnVtYmVycyddLFxuICAgIFsnbnpiJywgJ2FwcGxpY2F0aW9uL3gtbnpiJ10sXG4gICAgWydvYTInLCAnYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXMyJ10sXG4gICAgWydvYTMnLCAnYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXMzJ10sXG4gICAgWydvYXMnLCAnYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXMnXSxcbiAgICBbJ29iZCcsICdhcHBsaWNhdGlvbi94LW1zYmluZGVyJ10sXG4gICAgWydvYmd4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVuYmxveC5nYW1lK3htbCddLFxuICAgIFsnb2JqJywgJ21vZGVsL29iaiddLFxuICAgIFsnb2RhJywgJ2FwcGxpY2F0aW9uL29kYSddLFxuICAgIFsnb2RiJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZGF0YWJhc2UnXSxcbiAgICBbJ29kYycsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmNoYXJ0J10sXG4gICAgWydvZGYnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5mb3JtdWxhJ10sXG4gICAgWydvZGZ0JywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZm9ybXVsYS10ZW1wbGF0ZSddLFxuICAgIFsnb2RnJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZ3JhcGhpY3MnXSxcbiAgICBbJ29kaScsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmltYWdlJ10sXG4gICAgWydvZG0nLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LW1hc3RlciddLFxuICAgIFsnb2RwJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uJ10sXG4gICAgWydvZHMnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldCddLFxuICAgIFsnb2R0JywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCddLFxuICAgIFsnb2dhJywgJ2F1ZGlvL29nZyddLFxuICAgIFsnb2dleCcsICdtb2RlbC92bmQub3BlbmdleCddLFxuICAgIFsnb2dnJywgJ2F1ZGlvL29nZyddLFxuICAgIFsnb2d2JywgJ3ZpZGVvL29nZyddLFxuICAgIFsnb2d4JywgJ2FwcGxpY2F0aW9uL29nZyddLFxuICAgIFsnb21kb2MnLCAnYXBwbGljYXRpb24vb21kb2MreG1sJ10sXG4gICAgWydvbmVwa2cnLCAnYXBwbGljYXRpb24vb25lbm90ZSddLFxuICAgIFsnb25ldG1wJywgJ2FwcGxpY2F0aW9uL29uZW5vdGUnXSxcbiAgICBbJ29uZXRvYycsICdhcHBsaWNhdGlvbi9vbmVub3RlJ10sXG4gICAgWydvbmV0b2MyJywgJ2FwcGxpY2F0aW9uL29uZW5vdGUnXSxcbiAgICBbJ29wZicsICdhcHBsaWNhdGlvbi9vZWJwcy1wYWNrYWdlK3htbCddLFxuICAgIFsnb3BtbCcsICd0ZXh0L3gtb3BtbCddLFxuICAgIFsnb3ByYycsICdhcHBsaWNhdGlvbi92bmQucGFsbSddLFxuICAgIFsnb3B1cycsICdhdWRpby9vZ2cnXSxcbiAgICBbJ29yZycsICd0ZXh0L3gtb3JnJ10sXG4gICAgWydvc2YnLCAnYXBwbGljYXRpb24vdm5kLnlhbWFoYS5vcGVuc2NvcmVmb3JtYXQnXSxcbiAgICBbJ29zZnB2ZycsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLm9wZW5zY29yZWZvcm1hdC5vc2ZwdmcreG1sJ10sXG4gICAgWydvc20nLCAnYXBwbGljYXRpb24vdm5kLm9wZW5zdHJlZXRtYXAuZGF0YSt4bWwnXSxcbiAgICBbJ290YycsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmNoYXJ0LXRlbXBsYXRlJ10sXG4gICAgWydvdGYnLCAnZm9udC9vdGYnXSxcbiAgICBbJ290ZycsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmdyYXBoaWNzLXRlbXBsYXRlJ10sXG4gICAgWydvdGgnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LXdlYiddLFxuICAgIFsnb3RpJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuaW1hZ2UtdGVtcGxhdGUnXSxcbiAgICBbJ290cCcsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbi10ZW1wbGF0ZSddLFxuICAgIFsnb3RzJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQtdGVtcGxhdGUnXSxcbiAgICBbJ290dCcsICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtdGVtcGxhdGUnXSxcbiAgICBbJ292YScsICdhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtb3ZhJ10sXG4gICAgWydvdmYnLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LW92ZiddLFxuICAgIFsnb3dsJywgJ2FwcGxpY2F0aW9uL3JkZit4bWwnXSxcbiAgICBbJ294cHMnLCAnYXBwbGljYXRpb24vb3hwcyddLFxuICAgIFsnb3h0JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVub2ZmaWNlb3JnLmV4dGVuc2lvbiddLFxuICAgIFsncCcsICd0ZXh0L3gtcGFzY2FsJ10sXG4gICAgWydwN2EnLCAnYXBwbGljYXRpb24veC1wa2NzNy1zaWduYXR1cmUnXSxcbiAgICBbJ3A3YicsICdhcHBsaWNhdGlvbi94LXBrY3M3LWNlcnRpZmljYXRlcyddLFxuICAgIFsncDdjJywgJ2FwcGxpY2F0aW9uL3BrY3M3LW1pbWUnXSxcbiAgICBbJ3A3bScsICdhcHBsaWNhdGlvbi9wa2NzNy1taW1lJ10sXG4gICAgWydwN3InLCAnYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0cmVxcmVzcCddLFxuICAgIFsncDdzJywgJ2FwcGxpY2F0aW9uL3BrY3M3LXNpZ25hdHVyZSddLFxuICAgIFsncDgnLCAnYXBwbGljYXRpb24vcGtjczgnXSxcbiAgICBbJ3AxMCcsICdhcHBsaWNhdGlvbi94LXBrY3MxMCddLFxuICAgIFsncDEyJywgJ2FwcGxpY2F0aW9uL3gtcGtjczEyJ10sXG4gICAgWydwYWMnLCAnYXBwbGljYXRpb24veC1ucy1wcm94eS1hdXRvY29uZmlnJ10sXG4gICAgWydwYWdlcycsICdhcHBsaWNhdGlvbi94LWl3b3JrLXBhZ2VzLXNmZnBhZ2VzJ10sXG4gICAgWydwYXMnLCAndGV4dC94LXBhc2NhbCddLFxuICAgIFsncGF3JywgJ2FwcGxpY2F0aW9uL3ZuZC5wYXdhYWZpbGUnXSxcbiAgICBbJ3BiZCcsICdhcHBsaWNhdGlvbi92bmQucG93ZXJidWlsZGVyNiddLFxuICAgIFsncGJtJywgJ2ltYWdlL3gtcG9ydGFibGUtYml0bWFwJ10sXG4gICAgWydwY2FwJywgJ2FwcGxpY2F0aW9uL3ZuZC50Y3BkdW1wLnBjYXAnXSxcbiAgICBbJ3BjZicsICdhcHBsaWNhdGlvbi94LWZvbnQtcGNmJ10sXG4gICAgWydwY2wnLCAnYXBwbGljYXRpb24vdm5kLmhwLXBjbCddLFxuICAgIFsncGNseGwnLCAnYXBwbGljYXRpb24vdm5kLmhwLXBjbHhsJ10sXG4gICAgWydwY3QnLCAnaW1hZ2UveC1waWN0J10sXG4gICAgWydwY3VybCcsICdhcHBsaWNhdGlvbi92bmQuY3VybC5wY3VybCddLFxuICAgIFsncGN4JywgJ2ltYWdlL3gtcGN4J10sXG4gICAgWydwZGInLCAnYXBwbGljYXRpb24veC1waWxvdCddLFxuICAgIFsncGRlJywgJ3RleHQveC1wcm9jZXNzaW5nJ10sXG4gICAgWydwZGYnLCAnYXBwbGljYXRpb24vcGRmJ10sXG4gICAgWydwZW0nLCAnYXBwbGljYXRpb24veC14NTA5LXVzZXItY2VydCddLFxuICAgIFsncGZhJywgJ2FwcGxpY2F0aW9uL3gtZm9udC10eXBlMSddLFxuICAgIFsncGZiJywgJ2FwcGxpY2F0aW9uL3gtZm9udC10eXBlMSddLFxuICAgIFsncGZtJywgJ2FwcGxpY2F0aW9uL3gtZm9udC10eXBlMSddLFxuICAgIFsncGZyJywgJ2FwcGxpY2F0aW9uL2ZvbnQtdGRwZnInXSxcbiAgICBbJ3BmeCcsICdhcHBsaWNhdGlvbi94LXBrY3MxMiddLFxuICAgIFsncGdtJywgJ2ltYWdlL3gtcG9ydGFibGUtZ3JheW1hcCddLFxuICAgIFsncGduJywgJ2FwcGxpY2F0aW9uL3gtY2hlc3MtcGduJ10sXG4gICAgWydwZ3AnLCAnYXBwbGljYXRpb24vcGdwJ10sXG4gICAgWydwaHAnLCAnYXBwbGljYXRpb24veC1odHRwZC1waHAnXSxcbiAgICBbJ3BocDMnLCAnYXBwbGljYXRpb24veC1odHRwZC1waHAnXSxcbiAgICBbJ3BocDQnLCAnYXBwbGljYXRpb24veC1odHRwZC1waHAnXSxcbiAgICBbJ3BocHMnLCAnYXBwbGljYXRpb24veC1odHRwZC1waHAtc291cmNlJ10sXG4gICAgWydwaHRtbCcsICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCddLFxuICAgIFsncGljJywgJ2ltYWdlL3gtcGljdCddLFxuICAgIFsncGtnJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsncGtpJywgJ2FwcGxpY2F0aW9uL3BraXhjbXAnXSxcbiAgICBbJ3BraXBhdGgnLCAnYXBwbGljYXRpb24vcGtpeC1wa2lwYXRoJ10sXG4gICAgWydwa3Bhc3MnLCAnYXBwbGljYXRpb24vdm5kLmFwcGxlLnBrcGFzcyddLFxuICAgIFsncGwnLCAnYXBwbGljYXRpb24veC1wZXJsJ10sXG4gICAgWydwbGInLCAnYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LWxhcmdlJ10sXG4gICAgWydwbGMnLCAnYXBwbGljYXRpb24vdm5kLm1vYml1cy5wbGMnXSxcbiAgICBbJ3BsZicsICdhcHBsaWNhdGlvbi92bmQucG9ja2V0bGVhcm4nXSxcbiAgICBbJ3BscycsICdhcHBsaWNhdGlvbi9wbHMreG1sJ10sXG4gICAgWydwbScsICdhcHBsaWNhdGlvbi94LXBlcmwnXSxcbiAgICBbJ3BtbCcsICdhcHBsaWNhdGlvbi92bmQuY3RjLXBvc21sJ10sXG4gICAgWydwbmcnLCAnaW1hZ2UvcG5nJ10sXG4gICAgWydwbm0nLCAnaW1hZ2UveC1wb3J0YWJsZS1hbnltYXAnXSxcbiAgICBbJ3BvcnRwa2cnLCAnYXBwbGljYXRpb24vdm5kLm1hY3BvcnRzLnBvcnRwa2cnXSxcbiAgICBbJ3BvdCcsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCddLFxuICAgIFsncG90bScsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5wcmVzZW50YXRpb24ubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWydwb3R4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC50ZW1wbGF0ZSddLFxuICAgIFsncHBhJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J10sXG4gICAgWydwcGFtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LmFkZGluLm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsncHBkJywgJ2FwcGxpY2F0aW9uL3ZuZC5jdXBzLXBwZCddLFxuICAgIFsncHBtJywgJ2ltYWdlL3gtcG9ydGFibGUtcGl4bWFwJ10sXG4gICAgWydwcHMnLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXSxcbiAgICBbJ3Bwc20nLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuc2xpZGVzaG93Lm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsncHBzeCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGVzaG93J10sXG4gICAgWydwcHQnLCAnYXBwbGljYXRpb24vcG93ZXJwb2ludCddLFxuICAgIFsncHB0bScsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5wcmVzZW50YXRpb24ubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWydwcHR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nXSxcbiAgICBbJ3BxYScsICdhcHBsaWNhdGlvbi92bmQucGFsbSddLFxuICAgIFsncHJjJywgJ2FwcGxpY2F0aW9uL3gtcGlsb3QnXSxcbiAgICBbJ3ByZScsICdhcHBsaWNhdGlvbi92bmQubG90dXMtZnJlZWxhbmNlJ10sXG4gICAgWydwcmYnLCAnYXBwbGljYXRpb24vcGljcy1ydWxlcyddLFxuICAgIFsncHJvdngnLCAnYXBwbGljYXRpb24vcHJvdmVuYW5jZSt4bWwnXSxcbiAgICBbJ3BzJywgJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXSxcbiAgICBbJ3BzYicsICdhcHBsaWNhdGlvbi92bmQuM2dwcC5waWMtYnctc21hbGwnXSxcbiAgICBbJ3BzZCcsICdhcHBsaWNhdGlvbi94LXBob3Rvc2hvcCddLFxuICAgIFsncHNmJywgJ2FwcGxpY2F0aW9uL3gtZm9udC1saW51eC1wc2YnXSxcbiAgICBbJ3Bza2N4bWwnLCAnYXBwbGljYXRpb24vcHNrYyt4bWwnXSxcbiAgICBbJ3B0aScsICdpbWFnZS9wcnMucHRpJ10sXG4gICAgWydwdGlkJywgJ2FwcGxpY2F0aW9uL3ZuZC5wdmkucHRpZDEnXSxcbiAgICBbJ3B1YicsICdhcHBsaWNhdGlvbi94LW1zcHVibGlzaGVyJ10sXG4gICAgWydwdmInLCAnYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LXZhciddLFxuICAgIFsncHduJywgJ2FwcGxpY2F0aW9uL3ZuZC4zbS5wb3N0LWl0LW5vdGVzJ10sXG4gICAgWydweWEnLCAnYXVkaW8vdm5kLm1zLXBsYXlyZWFkeS5tZWRpYS5weWEnXSxcbiAgICBbJ3B5dicsICd2aWRlby92bmQubXMtcGxheXJlYWR5Lm1lZGlhLnB5diddLFxuICAgIFsncWFtJywgJ2FwcGxpY2F0aW9uL3ZuZC5lcHNvbi5xdWlja2FuaW1lJ10sXG4gICAgWydxYm8nLCAnYXBwbGljYXRpb24vdm5kLmludHUucWJvJ10sXG4gICAgWydxZngnLCAnYXBwbGljYXRpb24vdm5kLmludHUucWZ4J10sXG4gICAgWydxcHMnLCAnYXBwbGljYXRpb24vdm5kLnB1Ymxpc2hhcmUtZGVsdGEtdHJlZSddLFxuICAgIFsncXQnLCAndmlkZW8vcXVpY2t0aW1lJ10sXG4gICAgWydxd2QnLCAnYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzJ10sXG4gICAgWydxd3QnLCAnYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzJ10sXG4gICAgWydxeGInLCAnYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzJ10sXG4gICAgWydxeGQnLCAnYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzJ10sXG4gICAgWydxeGwnLCAnYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzJ10sXG4gICAgWydxeHQnLCAnYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzJ10sXG4gICAgWydyYScsICdhdWRpby94LXJlYWxhdWRpbyddLFxuICAgIFsncmFtJywgJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ10sXG4gICAgWydyYW1sJywgJ2FwcGxpY2F0aW9uL3JhbWwreWFtbCddLFxuICAgIFsncmFwZCcsICdhcHBsaWNhdGlvbi9yb3V0ZS1hcGQreG1sJ10sXG4gICAgWydyYXInLCAnYXBwbGljYXRpb24veC1yYXInXSxcbiAgICBbJ3JhcycsICdpbWFnZS94LWNtdS1yYXN0ZXInXSxcbiAgICBbJ3JjcHJvZmlsZScsICdhcHBsaWNhdGlvbi92bmQuaXB1bnBsdWdnZWQucmNwcm9maWxlJ10sXG4gICAgWydyZGYnLCAnYXBwbGljYXRpb24vcmRmK3htbCddLFxuICAgIFsncmR6JywgJ2FwcGxpY2F0aW9uL3ZuZC5kYXRhLXZpc2lvbi5yZHonXSxcbiAgICBbJ3JlbG8nLCAnYXBwbGljYXRpb24vcDJwLW92ZXJsYXkreG1sJ10sXG4gICAgWydyZXAnLCAnYXBwbGljYXRpb24vdm5kLmJ1c2luZXNzb2JqZWN0cyddLFxuICAgIFsncmVzJywgJ2FwcGxpY2F0aW9uL3gtZHRicmVzb3VyY2UreG1sJ10sXG4gICAgWydyZ2InLCAnaW1hZ2UveC1yZ2InXSxcbiAgICBbJ3JpZicsICdhcHBsaWNhdGlvbi9yZWdpbmZvK3htbCddLFxuICAgIFsncmlwJywgJ2F1ZGlvL3ZuZC5yaXAnXSxcbiAgICBbJ3JpcycsICdhcHBsaWNhdGlvbi94LXJlc2VhcmNoLWluZm8tc3lzdGVtcyddLFxuICAgIFsncmwnLCAnYXBwbGljYXRpb24vcmVzb3VyY2UtbGlzdHMreG1sJ10sXG4gICAgWydybGMnLCAnaW1hZ2Uvdm5kLmZ1aml4ZXJveC5lZG1pY3MtcmxjJ10sXG4gICAgWydybGQnLCAnYXBwbGljYXRpb24vcmVzb3VyY2UtbGlzdHMtZGlmZit4bWwnXSxcbiAgICBbJ3JtJywgJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ10sXG4gICAgWydybWknLCAnYXVkaW8vbWlkaSddLFxuICAgIFsncm1wJywgJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvLXBsdWdpbiddLFxuICAgIFsncm1zJywgJ2FwcGxpY2F0aW9uL3ZuZC5qY3AuamF2YW1lLm1pZGxldC1ybXMnXSxcbiAgICBbJ3JtdmInLCAnYXBwbGljYXRpb24vdm5kLnJuLXJlYWxtZWRpYS12YnInXSxcbiAgICBbJ3JuYycsICdhcHBsaWNhdGlvbi9yZWxheC1uZy1jb21wYWN0LXN5bnRheCddLFxuICAgIFsncm5nJywgJ2FwcGxpY2F0aW9uL3htbCddLFxuICAgIFsncm9hJywgJ2FwcGxpY2F0aW9uL3Jwa2ktcm9hJ10sXG4gICAgWydyb2ZmJywgJ3RleHQvdHJvZmYnXSxcbiAgICBbJ3JwOScsICdhcHBsaWNhdGlvbi92bmQuY2xvYW50by5ycDknXSxcbiAgICBbJ3JwbScsICdhdWRpby94LXBuLXJlYWxhdWRpby1wbHVnaW4nXSxcbiAgICBbJ3Jwc3MnLCAnYXBwbGljYXRpb24vdm5kLm5va2lhLnJhZGlvLXByZXNldHMnXSxcbiAgICBbJ3Jwc3QnLCAnYXBwbGljYXRpb24vdm5kLm5va2lhLnJhZGlvLXByZXNldCddLFxuICAgIFsncnEnLCAnYXBwbGljYXRpb24vc3BhcnFsLXF1ZXJ5J10sXG4gICAgWydycycsICdhcHBsaWNhdGlvbi9ybHMtc2VydmljZXMreG1sJ10sXG4gICAgWydyc2EnLCAnYXBwbGljYXRpb24veC1wa2NzNyddLFxuICAgIFsncnNhdCcsICdhcHBsaWNhdGlvbi9hdHNjLXJzYXQreG1sJ10sXG4gICAgWydyc2QnLCAnYXBwbGljYXRpb24vcnNkK3htbCddLFxuICAgIFsncnNoZWV0JywgJ2FwcGxpY2F0aW9uL3VyYy1yZXNzaGVldCt4bWwnXSxcbiAgICBbJ3JzcycsICdhcHBsaWNhdGlvbi9yc3MreG1sJ10sXG4gICAgWydydGYnLCAndGV4dC9ydGYnXSxcbiAgICBbJ3J0eCcsICd0ZXh0L3JpY2h0ZXh0J10sXG4gICAgWydydW4nLCAnYXBwbGljYXRpb24veC1tYWtlc2VsZiddLFxuICAgIFsncnVzZCcsICdhcHBsaWNhdGlvbi9yb3V0ZS11c2QreG1sJ10sXG4gICAgWydydicsICd2aWRlby92bmQucm4tcmVhbHZpZGVvJ10sXG4gICAgWydzJywgJ3RleHQveC1hc20nXSxcbiAgICBbJ3MzbScsICdhdWRpby9zM20nXSxcbiAgICBbJ3NhZicsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLnNtYWYtYXVkaW8nXSxcbiAgICBbJ3Nhc3MnLCAndGV4dC94LXNhc3MnXSxcbiAgICBbJ3NibWwnLCAnYXBwbGljYXRpb24vc2JtbCt4bWwnXSxcbiAgICBbJ3NjJywgJ2FwcGxpY2F0aW9uL3ZuZC5pYm0uc2VjdXJlLWNvbnRhaW5lciddLFxuICAgIFsnc2NkJywgJ2FwcGxpY2F0aW9uL3gtbXNzY2hlZHVsZSddLFxuICAgIFsnc2NtJywgJ2FwcGxpY2F0aW9uL3ZuZC5sb3R1cy1zY3JlZW5jYW0nXSxcbiAgICBbJ3NjcScsICdhcHBsaWNhdGlvbi9zY3ZwLWN2LXJlcXVlc3QnXSxcbiAgICBbJ3NjcycsICdhcHBsaWNhdGlvbi9zY3ZwLWN2LXJlc3BvbnNlJ10sXG4gICAgWydzY3NzJywgJ3RleHQveC1zY3NzJ10sXG4gICAgWydzY3VybCcsICd0ZXh0L3ZuZC5jdXJsLnNjdXJsJ10sXG4gICAgWydzZGEnLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5kcmF3J10sXG4gICAgWydzZGMnLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5jYWxjJ10sXG4gICAgWydzZGQnLCAnYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5pbXByZXNzJ10sXG4gICAgWydzZGtkJywgJ2FwcGxpY2F0aW9uL3ZuZC5zb2xlbnQuc2RrbSt4bWwnXSxcbiAgICBbJ3Nka20nLCAnYXBwbGljYXRpb24vdm5kLnNvbGVudC5zZGttK3htbCddLFxuICAgIFsnc2RwJywgJ2FwcGxpY2F0aW9uL3NkcCddLFxuICAgIFsnc2R3JywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24ud3JpdGVyJ10sXG4gICAgWydzZWEnLCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10sXG4gICAgWydzZWUnLCAnYXBwbGljYXRpb24vdm5kLnNlZW1haWwnXSxcbiAgICBbJ3NlZWQnLCAnYXBwbGljYXRpb24vdm5kLmZkc24uc2VlZCddLFxuICAgIFsnc2VtYScsICdhcHBsaWNhdGlvbi92bmQuc2VtYSddLFxuICAgIFsnc2VtZCcsICdhcHBsaWNhdGlvbi92bmQuc2VtZCddLFxuICAgIFsnc2VtZicsICdhcHBsaWNhdGlvbi92bmQuc2VtZiddLFxuICAgIFsnc2VubWx4JywgJ2FwcGxpY2F0aW9uL3Nlbm1sK3htbCddLFxuICAgIFsnc2Vuc21seCcsICdhcHBsaWNhdGlvbi9zZW5zbWwreG1sJ10sXG4gICAgWydzZXInLCAnYXBwbGljYXRpb24vamF2YS1zZXJpYWxpemVkLW9iamVjdCddLFxuICAgIFsnc2V0cGF5JywgJ2FwcGxpY2F0aW9uL3NldC1wYXltZW50LWluaXRpYXRpb24nXSxcbiAgICBbJ3NldHJlZycsICdhcHBsaWNhdGlvbi9zZXQtcmVnaXN0cmF0aW9uLWluaXRpYXRpb24nXSxcbiAgICBbJ3NmZC1oZHN0eCcsICdhcHBsaWNhdGlvbi92bmQuaHlkcm9zdGF0aXguc29mLWRhdGEnXSxcbiAgICBbJ3NmcycsICdhcHBsaWNhdGlvbi92bmQuc3BvdGZpcmUuc2ZzJ10sXG4gICAgWydzZnYnLCAndGV4dC94LXNmdiddLFxuICAgIFsnc2dpJywgJ2ltYWdlL3NnaSddLFxuICAgIFsnc2dsJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24ud3JpdGVyLWdsb2JhbCddLFxuICAgIFsnc2dtJywgJ3RleHQvc2dtbCddLFxuICAgIFsnc2dtbCcsICd0ZXh0L3NnbWwnXSxcbiAgICBbJ3NoJywgJ2FwcGxpY2F0aW9uL3gtc2gnXSxcbiAgICBbJ3NoYXInLCAnYXBwbGljYXRpb24veC1zaGFyJ10sXG4gICAgWydzaGV4JywgJ3RleHQvc2hleCddLFxuICAgIFsnc2hmJywgJ2FwcGxpY2F0aW9uL3NoZit4bWwnXSxcbiAgICBbJ3NodG1sJywgJ3RleHQvaHRtbCddLFxuICAgIFsnc2lkJywgJ2ltYWdlL3gtbXJzaWQtaW1hZ2UnXSxcbiAgICBbJ3NpZXZlJywgJ2FwcGxpY2F0aW9uL3NpZXZlJ10sXG4gICAgWydzaWcnLCAnYXBwbGljYXRpb24vcGdwLXNpZ25hdHVyZSddLFxuICAgIFsnc2lsJywgJ2F1ZGlvL3NpbGsnXSxcbiAgICBbJ3NpbG8nLCAnbW9kZWwvbWVzaCddLFxuICAgIFsnc2lzJywgJ2FwcGxpY2F0aW9uL3ZuZC5zeW1iaWFuLmluc3RhbGwnXSxcbiAgICBbJ3Npc3gnLCAnYXBwbGljYXRpb24vdm5kLnN5bWJpYW4uaW5zdGFsbCddLFxuICAgIFsnc2l0JywgJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCddLFxuICAgIFsnc2l0eCcsICdhcHBsaWNhdGlvbi94LXN0dWZmaXR4J10sXG4gICAgWydzaXYnLCAnYXBwbGljYXRpb24vc2lldmUnXSxcbiAgICBbJ3NrZCcsICdhcHBsaWNhdGlvbi92bmQua29hbiddLFxuICAgIFsnc2ttJywgJ2FwcGxpY2F0aW9uL3ZuZC5rb2FuJ10sXG4gICAgWydza3AnLCAnYXBwbGljYXRpb24vdm5kLmtvYW4nXSxcbiAgICBbJ3NrdCcsICdhcHBsaWNhdGlvbi92bmQua29hbiddLFxuICAgIFsnc2xkbScsICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZS5tYWNyb2VuYWJsZWQuMTInXSxcbiAgICBbJ3NsZHgnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnNsaWRlJ10sXG4gICAgWydzbGltJywgJ3RleHQvc2xpbSddLFxuICAgIFsnc2xtJywgJ3RleHQvc2xpbSddLFxuICAgIFsnc2xzJywgJ2FwcGxpY2F0aW9uL3JvdXRlLXMtdHNpZCt4bWwnXSxcbiAgICBbJ3NsdCcsICdhcHBsaWNhdGlvbi92bmQuZXBzb24uc2FsdCddLFxuICAgIFsnc20nLCAnYXBwbGljYXRpb24vdm5kLnN0ZXBtYW5pYS5zdGVwY2hhcnQnXSxcbiAgICBbJ3NtZicsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLm1hdGgnXSxcbiAgICBbJ3NtaScsICdhcHBsaWNhdGlvbi9zbWlsJ10sXG4gICAgWydzbWlsJywgJ2FwcGxpY2F0aW9uL3NtaWwnXSxcbiAgICBbJ3NtdicsICd2aWRlby94LXNtdiddLFxuICAgIFsnc216aXAnLCAnYXBwbGljYXRpb24vdm5kLnN0ZXBtYW5pYS5wYWNrYWdlJ10sXG4gICAgWydzbmQnLCAnYXVkaW8vYmFzaWMnXSxcbiAgICBbJ3NuZicsICdhcHBsaWNhdGlvbi94LWZvbnQtc25mJ10sXG4gICAgWydzbycsICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXSxcbiAgICBbJ3NwYycsICdhcHBsaWNhdGlvbi94LXBrY3M3LWNlcnRpZmljYXRlcyddLFxuICAgIFsnc3BkeCcsICd0ZXh0L3NwZHgnXSxcbiAgICBbJ3NwZicsICdhcHBsaWNhdGlvbi92bmQueWFtYWhhLnNtYWYtcGhyYXNlJ10sXG4gICAgWydzcGwnLCAnYXBwbGljYXRpb24veC1mdXR1cmVzcGxhc2gnXSxcbiAgICBbJ3Nwb3QnLCAndGV4dC92bmQuaW4zZC5zcG90J10sXG4gICAgWydzcHAnLCAnYXBwbGljYXRpb24vc2N2cC12cC1yZXNwb25zZSddLFxuICAgIFsnc3BxJywgJ2FwcGxpY2F0aW9uL3NjdnAtdnAtcmVxdWVzdCddLFxuICAgIFsnc3B4JywgJ2F1ZGlvL29nZyddLFxuICAgIFsnc3FsJywgJ2FwcGxpY2F0aW9uL3gtc3FsJ10sXG4gICAgWydzcmMnLCAnYXBwbGljYXRpb24veC13YWlzLXNvdXJjZSddLFxuICAgIFsnc3J0JywgJ2FwcGxpY2F0aW9uL3gtc3VicmlwJ10sXG4gICAgWydzcnUnLCAnYXBwbGljYXRpb24vc3J1K3htbCddLFxuICAgIFsnc3J4JywgJ2FwcGxpY2F0aW9uL3NwYXJxbC1yZXN1bHRzK3htbCddLFxuICAgIFsnc3NkbCcsICdhcHBsaWNhdGlvbi9zc2RsK3htbCddLFxuICAgIFsnc3NlJywgJ2FwcGxpY2F0aW9uL3ZuZC5rb2Rhay1kZXNjcmlwdG9yJ10sXG4gICAgWydzc2YnLCAnYXBwbGljYXRpb24vdm5kLmVwc29uLnNzZiddLFxuICAgIFsnc3NtbCcsICdhcHBsaWNhdGlvbi9zc21sK3htbCddLFxuICAgIFsnc3N0JywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnc3QnLCAnYXBwbGljYXRpb24vdm5kLnNhaWxpbmd0cmFja2VyLnRyYWNrJ10sXG4gICAgWydzdGMnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuY2FsYy50ZW1wbGF0ZSddLFxuICAgIFsnc3RkJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmRyYXcudGVtcGxhdGUnXSxcbiAgICBbJ3N0ZicsICdhcHBsaWNhdGlvbi92bmQud3Quc3RmJ10sXG4gICAgWydzdGknLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuaW1wcmVzcy50ZW1wbGF0ZSddLFxuICAgIFsnc3RrJywgJ2FwcGxpY2F0aW9uL2h5cGVyc3R1ZGlvJ10sXG4gICAgWydzdGwnLCAnbW9kZWwvc3RsJ10sXG4gICAgWydzdHB4JywgJ21vZGVsL3N0ZXAreG1sJ10sXG4gICAgWydzdHB4eicsICdtb2RlbC9zdGVwLXhtbCt6aXAnXSxcbiAgICBbJ3N0cHonLCAnbW9kZWwvc3RlcCt6aXAnXSxcbiAgICBbJ3N0cicsICdhcHBsaWNhdGlvbi92bmQucGcuZm9ybWF0J10sXG4gICAgWydzdHcnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwud3JpdGVyLnRlbXBsYXRlJ10sXG4gICAgWydzdHlsJywgJ3RleHQvc3R5bHVzJ10sXG4gICAgWydzdHlsdXMnLCAndGV4dC9zdHlsdXMnXSxcbiAgICBbJ3N1YicsICd0ZXh0L3ZuZC5kdmIuc3VidGl0bGUnXSxcbiAgICBbJ3N1cycsICdhcHBsaWNhdGlvbi92bmQuc3VzLWNhbGVuZGFyJ10sXG4gICAgWydzdXNwJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdXMtY2FsZW5kYXInXSxcbiAgICBbJ3N2NGNwaW8nLCAnYXBwbGljYXRpb24veC1zdjRjcGlvJ10sXG4gICAgWydzdjRjcmMnLCAnYXBwbGljYXRpb24veC1zdjRjcmMnXSxcbiAgICBbJ3N2YycsICdhcHBsaWNhdGlvbi92bmQuZHZiLnNlcnZpY2UnXSxcbiAgICBbJ3N2ZCcsICdhcHBsaWNhdGlvbi92bmQuc3ZkJ10sXG4gICAgWydzdmcnLCAnaW1hZ2Uvc3ZnK3htbCddLFxuICAgIFsnc3ZneicsICdpbWFnZS9zdmcreG1sJ10sXG4gICAgWydzd2EnLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnc3dmJywgJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ10sXG4gICAgWydzd2knLCAnYXBwbGljYXRpb24vdm5kLmFyaXN0YW5ldHdvcmtzLnN3aSddLFxuICAgIFsnc3dpZHRhZycsICdhcHBsaWNhdGlvbi9zd2lkK3htbCddLFxuICAgIFsnc3hjJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmNhbGMnXSxcbiAgICBbJ3N4ZCcsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3J10sXG4gICAgWydzeGcnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwud3JpdGVyLmdsb2JhbCddLFxuICAgIFsnc3hpJywgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmltcHJlc3MnXSxcbiAgICBbJ3N4bScsICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5tYXRoJ10sXG4gICAgWydzeHcnLCAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwud3JpdGVyJ10sXG4gICAgWyd0JywgJ3RleHQvdHJvZmYnXSxcbiAgICBbJ3QzJywgJ2FwcGxpY2F0aW9uL3gtdDN2bS1pbWFnZSddLFxuICAgIFsndDM4JywgJ2ltYWdlL3QzOCddLFxuICAgIFsndGFnbGV0JywgJ2FwcGxpY2F0aW9uL3ZuZC5teW5mYyddLFxuICAgIFsndGFvJywgJ2FwcGxpY2F0aW9uL3ZuZC50YW8uaW50ZW50LW1vZHVsZS1hcmNoaXZlJ10sXG4gICAgWyd0YXAnLCAnaW1hZ2Uvdm5kLnRlbmNlbnQudGFwJ10sXG4gICAgWyd0YXInLCAnYXBwbGljYXRpb24veC10YXInXSxcbiAgICBbJ3RjYXAnLCAnYXBwbGljYXRpb24vdm5kLjNncHAyLnRjYXAnXSxcbiAgICBbJ3RjbCcsICdhcHBsaWNhdGlvbi94LXRjbCddLFxuICAgIFsndGQnLCAnYXBwbGljYXRpb24vdXJjLXRhcmdldGRlc2MreG1sJ10sXG4gICAgWyd0ZWFjaGVyJywgJ2FwcGxpY2F0aW9uL3ZuZC5zbWFydC50ZWFjaGVyJ10sXG4gICAgWyd0ZWknLCAnYXBwbGljYXRpb24vdGVpK3htbCddLFxuICAgIFsndGVpY29ycHVzJywgJ2FwcGxpY2F0aW9uL3RlaSt4bWwnXSxcbiAgICBbJ3RleCcsICdhcHBsaWNhdGlvbi94LXRleCddLFxuICAgIFsndGV4aScsICdhcHBsaWNhdGlvbi94LXRleGluZm8nXSxcbiAgICBbJ3RleGluZm8nLCAnYXBwbGljYXRpb24veC10ZXhpbmZvJ10sXG4gICAgWyd0ZXh0JywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ3RmaScsICdhcHBsaWNhdGlvbi90aHJhdWQreG1sJ10sXG4gICAgWyd0Zm0nLCAnYXBwbGljYXRpb24veC10ZXgtdGZtJ10sXG4gICAgWyd0ZngnLCAnaW1hZ2UvdGlmZi1meCddLFxuICAgIFsndGdhJywgJ2ltYWdlL3gtdGdhJ10sXG4gICAgWyd0Z3onLCAnYXBwbGljYXRpb24veC10YXInXSxcbiAgICBbJ3RobXgnLCAnYXBwbGljYXRpb24vdm5kLm1zLW9mZmljZXRoZW1lJ10sXG4gICAgWyd0aWYnLCAnaW1hZ2UvdGlmZiddLFxuICAgIFsndGlmZicsICdpbWFnZS90aWZmJ10sXG4gICAgWyd0aycsICdhcHBsaWNhdGlvbi94LXRjbCddLFxuICAgIFsndG1vJywgJ2FwcGxpY2F0aW9uL3ZuZC50bW9iaWxlLWxpdmV0diddLFxuICAgIFsndG9tbCcsICdhcHBsaWNhdGlvbi90b21sJ10sXG4gICAgWyd0b3JyZW50JywgJ2FwcGxpY2F0aW9uL3gtYml0dG9ycmVudCddLFxuICAgIFsndHBsJywgJ2FwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdG9vbC10ZW1wbGF0ZSddLFxuICAgIFsndHB0JywgJ2FwcGxpY2F0aW9uL3ZuZC50cmlkLnRwdCddLFxuICAgIFsndHInLCAndGV4dC90cm9mZiddLFxuICAgIFsndHJhJywgJ2FwcGxpY2F0aW9uL3ZuZC50cnVlYXBwJ10sXG4gICAgWyd0cmlnJywgJ2FwcGxpY2F0aW9uL3RyaWcnXSxcbiAgICBbJ3RybScsICdhcHBsaWNhdGlvbi94LW1zdGVybWluYWwnXSxcbiAgICBbJ3RzJywgJ3ZpZGVvL21wMnQnXSxcbiAgICBbJ3RzZCcsICdhcHBsaWNhdGlvbi90aW1lc3RhbXBlZC1kYXRhJ10sXG4gICAgWyd0c3YnLCAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcyddLFxuICAgIFsndHRjJywgJ2ZvbnQvY29sbGVjdGlvbiddLFxuICAgIFsndHRmJywgJ2ZvbnQvdHRmJ10sXG4gICAgWyd0dGwnLCAndGV4dC90dXJ0bGUnXSxcbiAgICBbJ3R0bWwnLCAnYXBwbGljYXRpb24vdHRtbCt4bWwnXSxcbiAgICBbJ3R3ZCcsICdhcHBsaWNhdGlvbi92bmQuc2ltdGVjaC1taW5kbWFwcGVyJ10sXG4gICAgWyd0d2RzJywgJ2FwcGxpY2F0aW9uL3ZuZC5zaW10ZWNoLW1pbmRtYXBwZXInXSxcbiAgICBbJ3R4ZCcsICdhcHBsaWNhdGlvbi92bmQuZ2Vub21hdGl4LnR1eGVkbyddLFxuICAgIFsndHhmJywgJ2FwcGxpY2F0aW9uL3ZuZC5tb2JpdXMudHhmJ10sXG4gICAgWyd0eHQnLCAndGV4dC9wbGFpbiddLFxuICAgIFsndThkc24nLCAnbWVzc2FnZS9nbG9iYWwtZGVsaXZlcnktc3RhdHVzJ10sXG4gICAgWyd1OGhkcicsICdtZXNzYWdlL2dsb2JhbC1oZWFkZXJzJ10sXG4gICAgWyd1OG1kbicsICdtZXNzYWdlL2dsb2JhbC1kaXNwb3NpdGlvbi1ub3RpZmljYXRpb24nXSxcbiAgICBbJ3U4bXNnJywgJ21lc3NhZ2UvZ2xvYmFsJ10sXG4gICAgWyd1MzInLCAnYXBwbGljYXRpb24veC1hdXRob3J3YXJlLWJpbiddLFxuICAgIFsndWJqJywgJ2FwcGxpY2F0aW9uL3VianNvbiddLFxuICAgIFsndWRlYicsICdhcHBsaWNhdGlvbi94LWRlYmlhbi1wYWNrYWdlJ10sXG4gICAgWyd1ZmQnLCAnYXBwbGljYXRpb24vdm5kLnVmZGwnXSxcbiAgICBbJ3VmZGwnLCAnYXBwbGljYXRpb24vdm5kLnVmZGwnXSxcbiAgICBbJ3VseCcsICdhcHBsaWNhdGlvbi94LWdsdWx4J10sXG4gICAgWyd1bWonLCAnYXBwbGljYXRpb24vdm5kLnVtYWppbiddLFxuICAgIFsndW5pdHl3ZWInLCAnYXBwbGljYXRpb24vdm5kLnVuaXR5J10sXG4gICAgWyd1b21sJywgJ2FwcGxpY2F0aW9uL3ZuZC51b21sK3htbCddLFxuICAgIFsndXJpJywgJ3RleHQvdXJpLWxpc3QnXSxcbiAgICBbJ3VyaXMnLCAndGV4dC91cmktbGlzdCddLFxuICAgIFsndXJscycsICd0ZXh0L3VyaS1saXN0J10sXG4gICAgWyd1c2R6JywgJ21vZGVsL3ZuZC51c2R6K3ppcCddLFxuICAgIFsndXN0YXInLCAnYXBwbGljYXRpb24veC11c3RhciddLFxuICAgIFsndXR6JywgJ2FwcGxpY2F0aW9uL3ZuZC51aXEudGhlbWUnXSxcbiAgICBbJ3V1JywgJ3RleHQveC11dWVuY29kZSddLFxuICAgIFsndXZhJywgJ2F1ZGlvL3ZuZC5kZWNlLmF1ZGlvJ10sXG4gICAgWyd1dmQnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UuZGF0YSddLFxuICAgIFsndXZmJywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLmRhdGEnXSxcbiAgICBbJ3V2ZycsICdpbWFnZS92bmQuZGVjZS5ncmFwaGljJ10sXG4gICAgWyd1dmgnLCAndmlkZW8vdm5kLmRlY2UuaGQnXSxcbiAgICBbJ3V2aScsICdpbWFnZS92bmQuZGVjZS5ncmFwaGljJ10sXG4gICAgWyd1dm0nLCAndmlkZW8vdm5kLmRlY2UubW9iaWxlJ10sXG4gICAgWyd1dnAnLCAndmlkZW8vdm5kLmRlY2UucGQnXSxcbiAgICBbJ3V2cycsICd2aWRlby92bmQuZGVjZS5zZCddLFxuICAgIFsndXZ0JywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLnR0bWwreG1sJ10sXG4gICAgWyd1dnUnLCAndmlkZW8vdm5kLnV2dnUubXA0J10sXG4gICAgWyd1dnYnLCAndmlkZW8vdm5kLmRlY2UudmlkZW8nXSxcbiAgICBbJ3V2dmEnLCAnYXVkaW8vdm5kLmRlY2UuYXVkaW8nXSxcbiAgICBbJ3V2dmQnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UuZGF0YSddLFxuICAgIFsndXZ2ZicsICdhcHBsaWNhdGlvbi92bmQuZGVjZS5kYXRhJ10sXG4gICAgWyd1dnZnJywgJ2ltYWdlL3ZuZC5kZWNlLmdyYXBoaWMnXSxcbiAgICBbJ3V2dmgnLCAndmlkZW8vdm5kLmRlY2UuaGQnXSxcbiAgICBbJ3V2dmknLCAnaW1hZ2Uvdm5kLmRlY2UuZ3JhcGhpYyddLFxuICAgIFsndXZ2bScsICd2aWRlby92bmQuZGVjZS5tb2JpbGUnXSxcbiAgICBbJ3V2dnAnLCAndmlkZW8vdm5kLmRlY2UucGQnXSxcbiAgICBbJ3V2dnMnLCAndmlkZW8vdm5kLmRlY2Uuc2QnXSxcbiAgICBbJ3V2dnQnLCAnYXBwbGljYXRpb24vdm5kLmRlY2UudHRtbCt4bWwnXSxcbiAgICBbJ3V2dnUnLCAndmlkZW8vdm5kLnV2dnUubXA0J10sXG4gICAgWyd1dnZ2JywgJ3ZpZGVvL3ZuZC5kZWNlLnZpZGVvJ10sXG4gICAgWyd1dnZ4JywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLnVuc3BlY2lmaWVkJ10sXG4gICAgWyd1dnZ6JywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLnppcCddLFxuICAgIFsndXZ4JywgJ2FwcGxpY2F0aW9uL3ZuZC5kZWNlLnVuc3BlY2lmaWVkJ10sXG4gICAgWyd1dnonLCAnYXBwbGljYXRpb24vdm5kLmRlY2UuemlwJ10sXG4gICAgWyd2Ym94JywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12Ym94J10sXG4gICAgWyd2Ym94LWV4dHBhY2snLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZib3gtZXh0cGFjayddLFxuICAgIFsndmNhcmQnLCAndGV4dC92Y2FyZCddLFxuICAgIFsndmNkJywgJ2FwcGxpY2F0aW9uL3gtY2RsaW5rJ10sXG4gICAgWyd2Y2YnLCAndGV4dC94LXZjYXJkJ10sXG4gICAgWyd2Y2cnLCAnYXBwbGljYXRpb24vdm5kLmdyb292ZS12Y2FyZCddLFxuICAgIFsndmNzJywgJ3RleHQveC12Y2FsZW5kYXInXSxcbiAgICBbJ3ZjeCcsICdhcHBsaWNhdGlvbi92bmQudmN4J10sXG4gICAgWyd2ZGknLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZkaSddLFxuICAgIFsndmRzJywgJ21vZGVsL3ZuZC5zYXAudmRzJ10sXG4gICAgWyd2aGQnLCAnYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZoZCddLFxuICAgIFsndmlzJywgJ2FwcGxpY2F0aW9uL3ZuZC52aXNpb25hcnknXSxcbiAgICBbJ3ZpdicsICd2aWRlby92bmQudml2byddLFxuICAgIFsndmxjJywgJ2FwcGxpY2F0aW9uL3ZpZGVvbGFuJ10sXG4gICAgWyd2bWRrJywgJ2FwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12bWRrJ10sXG4gICAgWyd2b2InLCAndmlkZW8veC1tcy12b2InXSxcbiAgICBbJ3ZvcicsICdhcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlciddLFxuICAgIFsndm94JywgJ2FwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1iaW4nXSxcbiAgICBbJ3ZybWwnLCAnbW9kZWwvdnJtbCddLFxuICAgIFsndnNkJywgJ2FwcGxpY2F0aW9uL3ZuZC52aXNpbyddLFxuICAgIFsndnNmJywgJ2FwcGxpY2F0aW9uL3ZuZC52c2YnXSxcbiAgICBbJ3ZzcycsICdhcHBsaWNhdGlvbi92bmQudmlzaW8nXSxcbiAgICBbJ3ZzdCcsICdhcHBsaWNhdGlvbi92bmQudmlzaW8nXSxcbiAgICBbJ3ZzdycsICdhcHBsaWNhdGlvbi92bmQudmlzaW8nXSxcbiAgICBbJ3Z0ZicsICdpbWFnZS92bmQudmFsdmUuc291cmNlLnRleHR1cmUnXSxcbiAgICBbJ3Z0dCcsICd0ZXh0L3Z0dCddLFxuICAgIFsndnR1JywgJ21vZGVsL3ZuZC52dHUnXSxcbiAgICBbJ3Z4bWwnLCAnYXBwbGljYXRpb24vdm9pY2V4bWwreG1sJ10sXG4gICAgWyd3M2QnLCAnYXBwbGljYXRpb24veC1kaXJlY3RvciddLFxuICAgIFsnd2FkJywgJ2FwcGxpY2F0aW9uL3gtZG9vbSddLFxuICAgIFsnd2FkbCcsICdhcHBsaWNhdGlvbi92bmQuc3VuLndhZGwreG1sJ10sXG4gICAgWyd3YXInLCAnYXBwbGljYXRpb24vamF2YS1hcmNoaXZlJ10sXG4gICAgWyd3YXNtJywgJ2FwcGxpY2F0aW9uL3dhc20nXSxcbiAgICBbJ3dhdicsICdhdWRpby94LXdhdiddLFxuICAgIFsnd2F4JywgJ2F1ZGlvL3gtbXMtd2F4J10sXG4gICAgWyd3Ym1wJywgJ2ltYWdlL3ZuZC53YXAud2JtcCddLFxuICAgIFsnd2JzJywgJ2FwcGxpY2F0aW9uL3ZuZC5jcml0aWNhbHRvb2xzLndicyt4bWwnXSxcbiAgICBbJ3dieG1sJywgJ2FwcGxpY2F0aW9uL3dieG1sJ10sXG4gICAgWyd3Y20nLCAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzJ10sXG4gICAgWyd3ZGInLCAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzJ10sXG4gICAgWyd3ZHAnLCAnaW1hZ2Uvdm5kLm1zLXBob3RvJ10sXG4gICAgWyd3ZWJhJywgJ2F1ZGlvL3dlYm0nXSxcbiAgICBbJ3dlYmFwcCcsICdhcHBsaWNhdGlvbi94LXdlYi1hcHAtbWFuaWZlc3QranNvbiddLFxuICAgIFsnd2VibScsICd2aWRlby93ZWJtJ10sXG4gICAgWyd3ZWJtYW5pZmVzdCcsICdhcHBsaWNhdGlvbi9tYW5pZmVzdCtqc29uJ10sXG4gICAgWyd3ZWJwJywgJ2ltYWdlL3dlYnAnXSxcbiAgICBbJ3dnJywgJ2FwcGxpY2F0aW9uL3ZuZC5wbWkud2lkZ2V0J10sXG4gICAgWyd3Z3QnLCAnYXBwbGljYXRpb24vd2lkZ2V0J10sXG4gICAgWyd3a3MnLCAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzJ10sXG4gICAgWyd3bScsICd2aWRlby94LW1zLXdtJ10sXG4gICAgWyd3bWEnLCAnYXVkaW8veC1tcy13bWEnXSxcbiAgICBbJ3dtZCcsICdhcHBsaWNhdGlvbi94LW1zLXdtZCddLFxuICAgIFsnd21mJywgJ2ltYWdlL3dtZiddLFxuICAgIFsnd21sJywgJ3RleHQvdm5kLndhcC53bWwnXSxcbiAgICBbJ3dtbGMnLCAnYXBwbGljYXRpb24vd21sYyddLFxuICAgIFsnd21scycsICd0ZXh0L3ZuZC53YXAud21sc2NyaXB0J10sXG4gICAgWyd3bWxzYycsICdhcHBsaWNhdGlvbi92bmQud2FwLndtbHNjcmlwdGMnXSxcbiAgICBbJ3dtdicsICd2aWRlby94LW1zLXdtdiddLFxuICAgIFsnd214JywgJ3ZpZGVvL3gtbXMtd214J10sXG4gICAgWyd3bXonLCAnYXBwbGljYXRpb24veC1tc21ldGFmaWxlJ10sXG4gICAgWyd3b2ZmJywgJ2ZvbnQvd29mZiddLFxuICAgIFsnd29mZjInLCAnZm9udC93b2ZmMiddLFxuICAgIFsnd29yZCcsICdhcHBsaWNhdGlvbi9tc3dvcmQnXSxcbiAgICBbJ3dwZCcsICdhcHBsaWNhdGlvbi92bmQud29yZHBlcmZlY3QnXSxcbiAgICBbJ3dwbCcsICdhcHBsaWNhdGlvbi92bmQubXMtd3BsJ10sXG4gICAgWyd3cHMnLCAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzJ10sXG4gICAgWyd3cWQnLCAnYXBwbGljYXRpb24vdm5kLndxZCddLFxuICAgIFsnd3JpJywgJ2FwcGxpY2F0aW9uL3gtbXN3cml0ZSddLFxuICAgIFsnd3JsJywgJ21vZGVsL3ZybWwnXSxcbiAgICBbJ3dzYycsICdtZXNzYWdlL3ZuZC53ZmEud3NjJ10sXG4gICAgWyd3c2RsJywgJ2FwcGxpY2F0aW9uL3dzZGwreG1sJ10sXG4gICAgWyd3c3BvbGljeScsICdhcHBsaWNhdGlvbi93c3BvbGljeSt4bWwnXSxcbiAgICBbJ3d0YicsICdhcHBsaWNhdGlvbi92bmQud2VidHVyYm8nXSxcbiAgICBbJ3d2eCcsICd2aWRlby94LW1zLXd2eCddLFxuICAgIFsneDNkJywgJ21vZGVsL3gzZCt4bWwnXSxcbiAgICBbJ3gzZGInLCAnbW9kZWwveDNkK2Zhc3RpbmZvc2V0J10sXG4gICAgWyd4M2RieicsICdtb2RlbC94M2QrYmluYXJ5J10sXG4gICAgWyd4M2R2JywgJ21vZGVsL3gzZC12cm1sJ10sXG4gICAgWyd4M2R2eicsICdtb2RlbC94M2QrdnJtbCddLFxuICAgIFsneDNkeicsICdtb2RlbC94M2QreG1sJ10sXG4gICAgWyd4MzInLCAnYXBwbGljYXRpb24veC1hdXRob3J3YXJlLWJpbiddLFxuICAgIFsneF9iJywgJ21vZGVsL3ZuZC5wYXJhc29saWQudHJhbnNtaXQuYmluYXJ5J10sXG4gICAgWyd4X3QnLCAnbW9kZWwvdm5kLnBhcmFzb2xpZC50cmFuc21pdC50ZXh0J10sXG4gICAgWyd4YW1sJywgJ2FwcGxpY2F0aW9uL3hhbWwreG1sJ10sXG4gICAgWyd4YXAnLCAnYXBwbGljYXRpb24veC1zaWx2ZXJsaWdodC1hcHAnXSxcbiAgICBbJ3hhcicsICdhcHBsaWNhdGlvbi92bmQueGFyYSddLFxuICAgIFsneGF2JywgJ2FwcGxpY2F0aW9uL3hjYXAtYXR0K3htbCddLFxuICAgIFsneGJhcCcsICdhcHBsaWNhdGlvbi94LW1zLXhiYXAnXSxcbiAgICBbJ3hiZCcsICdhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRvY3V3b3Jrcy5iaW5kZXInXSxcbiAgICBbJ3hibScsICdpbWFnZS94LXhiaXRtYXAnXSxcbiAgICBbJ3hjYScsICdhcHBsaWNhdGlvbi94Y2FwLWNhcHMreG1sJ10sXG4gICAgWyd4Y3MnLCAnYXBwbGljYXRpb24vY2FsZW5kYXIreG1sJ10sXG4gICAgWyd4ZGYnLCAnYXBwbGljYXRpb24veGNhcC1kaWZmK3htbCddLFxuICAgIFsneGRtJywgJ2FwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG0reG1sJ10sXG4gICAgWyd4ZHAnLCAnYXBwbGljYXRpb24vdm5kLmFkb2JlLnhkcCt4bWwnXSxcbiAgICBbJ3hkc3NjJywgJ2FwcGxpY2F0aW9uL2Rzc2MreG1sJ10sXG4gICAgWyd4ZHcnLCAnYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kb2N1d29ya3MnXSxcbiAgICBbJ3hlbCcsICdhcHBsaWNhdGlvbi94Y2FwLWVsK3htbCddLFxuICAgIFsneGVuYycsICdhcHBsaWNhdGlvbi94ZW5jK3htbCddLFxuICAgIFsneGVyJywgJ2FwcGxpY2F0aW9uL3BhdGNoLW9wcy1lcnJvcit4bWwnXSxcbiAgICBbJ3hmZGYnLCAnYXBwbGljYXRpb24vdm5kLmFkb2JlLnhmZGYnXSxcbiAgICBbJ3hmZGwnLCAnYXBwbGljYXRpb24vdm5kLnhmZGwnXSxcbiAgICBbJ3hodCcsICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnXSxcbiAgICBbJ3hodG1sJywgJ2FwcGxpY2F0aW9uL3hodG1sK3htbCddLFxuICAgIFsneGh2bWwnLCAnYXBwbGljYXRpb24veHYreG1sJ10sXG4gICAgWyd4aWYnLCAnaW1hZ2Uvdm5kLnhpZmYnXSxcbiAgICBbJ3hsJywgJ2FwcGxpY2F0aW9uL2V4Y2VsJ10sXG4gICAgWyd4bGEnLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ10sXG4gICAgWyd4bGFtJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5hZGRpbi5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3hsYycsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3hsZicsICdhcHBsaWNhdGlvbi94bGlmZit4bWwnXSxcbiAgICBbJ3hsbScsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3hscycsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3hsc2InLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0LmJpbmFyeS5tYWNyb0VuYWJsZWQuMTInXSxcbiAgICBbJ3hsc20nLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0Lm1hY3JvRW5hYmxlZC4xMiddLFxuICAgIFsneGxzeCcsICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCddLFxuICAgIFsneGx0JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCddLFxuICAgIFsneGx0bScsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9FbmFibGVkLjEyJ10sXG4gICAgWyd4bHR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnRlbXBsYXRlJ10sXG4gICAgWyd4bHcnLCAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ10sXG4gICAgWyd4bScsICdhdWRpby94bSddLFxuICAgIFsneG1sJywgJ2FwcGxpY2F0aW9uL3htbCddLFxuICAgIFsneG5zJywgJ2FwcGxpY2F0aW9uL3hjYXAtbnMreG1sJ10sXG4gICAgWyd4bycsICdhcHBsaWNhdGlvbi92bmQub2xwYy1zdWdhciddLFxuICAgIFsneG9wJywgJ2FwcGxpY2F0aW9uL3hvcCt4bWwnXSxcbiAgICBbJ3hwaScsICdhcHBsaWNhdGlvbi94LXhwaW5zdGFsbCddLFxuICAgIFsneHBsJywgJ2FwcGxpY2F0aW9uL3hwcm9jK3htbCddLFxuICAgIFsneHBtJywgJ2ltYWdlL3gteHBpeG1hcCddLFxuICAgIFsneHByJywgJ2FwcGxpY2F0aW9uL3ZuZC5pcy14cHInXSxcbiAgICBbJ3hwcycsICdhcHBsaWNhdGlvbi92bmQubXMteHBzZG9jdW1lbnQnXSxcbiAgICBbJ3hwdycsICdhcHBsaWNhdGlvbi92bmQuaW50ZXJjb24uZm9ybW5ldCddLFxuICAgIFsneHB4JywgJ2FwcGxpY2F0aW9uL3ZuZC5pbnRlcmNvbi5mb3JtbmV0J10sXG4gICAgWyd4c2QnLCAnYXBwbGljYXRpb24veG1sJ10sXG4gICAgWyd4c2wnLCAnYXBwbGljYXRpb24veG1sJ10sXG4gICAgWyd4c2x0JywgJ2FwcGxpY2F0aW9uL3hzbHQreG1sJ10sXG4gICAgWyd4c20nLCAnYXBwbGljYXRpb24vdm5kLnN5bmNtbCt4bWwnXSxcbiAgICBbJ3hzcGYnLCAnYXBwbGljYXRpb24veHNwZit4bWwnXSxcbiAgICBbJ3h1bCcsICdhcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sJ10sXG4gICAgWyd4dm0nLCAnYXBwbGljYXRpb24veHYreG1sJ10sXG4gICAgWyd4dm1sJywgJ2FwcGxpY2F0aW9uL3h2K3htbCddLFxuICAgIFsneHdkJywgJ2ltYWdlL3gteHdpbmRvd2R1bXAnXSxcbiAgICBbJ3h5eicsICdjaGVtaWNhbC94LXh5eiddLFxuICAgIFsneHonLCAnYXBwbGljYXRpb24veC14eiddLFxuICAgIFsneWFtbCcsICd0ZXh0L3lhbWwnXSxcbiAgICBbJ3lhbmcnLCAnYXBwbGljYXRpb24veWFuZyddLFxuICAgIFsneWluJywgJ2FwcGxpY2F0aW9uL3lpbit4bWwnXSxcbiAgICBbJ3ltbCcsICd0ZXh0L3lhbWwnXSxcbiAgICBbJ3ltcCcsICd0ZXh0L3gtc3VzZS15bXAnXSxcbiAgICBbJ3onLCAnYXBwbGljYXRpb24veC1jb21wcmVzcyddLFxuICAgIFsnejEnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejInLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejMnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejQnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejUnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejYnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejcnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnejgnLCAnYXBwbGljYXRpb24veC16bWFjaGluZSddLFxuICAgIFsnemF6JywgJ2FwcGxpY2F0aW9uL3ZuZC56emF6ei5kZWNrK3htbCddLFxuICAgIFsnemlwJywgJ2FwcGxpY2F0aW9uL3ppcCddLFxuICAgIFsnemlyJywgJ2FwcGxpY2F0aW9uL3ZuZC56dWwnXSxcbiAgICBbJ3ppcnonLCAnYXBwbGljYXRpb24vdm5kLnp1bCddLFxuICAgIFsnem1tJywgJ2FwcGxpY2F0aW9uL3ZuZC5oYW5kaGVsZC1lbnRlcnRhaW5tZW50K3htbCddLFxuICAgIFsnenNoJywgJ3RleHQveC1zY3JpcHR6c2gnXVxuXSk7XG5mdW5jdGlvbiB0b0ZpbGVXaXRoUGF0aChmaWxlLCBwYXRoLCBoKSB7XG4gICAgdmFyIGYgPSB3aXRoTWltZVR5cGUoZmlsZSk7XG4gICAgdmFyIHdlYmtpdFJlbGF0aXZlUGF0aCA9IGZpbGUud2Via2l0UmVsYXRpdmVQYXRoO1xuICAgIHZhciBwID0gdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnXG4gICAgICAgID8gcGF0aFxuICAgICAgICAvLyBJZiA8aW5wdXQgd2Via2l0ZGlyZWN0b3J5PiBpcyBzZXQsXG4gICAgICAgIC8vIHRoZSBGaWxlIHdpbGwgaGF2ZSBhIHt3ZWJraXRSZWxhdGl2ZVBhdGh9IHByb3BlcnR5XG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MSW5wdXRFbGVtZW50L3dlYmtpdGRpcmVjdG9yeVxuICAgICAgICA6IHR5cGVvZiB3ZWJraXRSZWxhdGl2ZVBhdGggPT09ICdzdHJpbmcnICYmIHdlYmtpdFJlbGF0aXZlUGF0aC5sZW5ndGggPiAwXG4gICAgICAgICAgICA/IHdlYmtpdFJlbGF0aXZlUGF0aFxuICAgICAgICAgICAgOiBcIi4vXCIuY29uY2F0KGZpbGUubmFtZSk7XG4gICAgaWYgKHR5cGVvZiBmLnBhdGggIT09ICdzdHJpbmcnKSB7IC8vIG9uIGVsZWN0cm9uLCBwYXRoIGlzIGFscmVhZHkgc2V0IHRvIHRoZSBhYnNvbHV0ZSBwYXRoXG4gICAgICAgIHNldE9ialByb3AoZiwgJ3BhdGgnLCBwKTtcbiAgICB9XG4gICAgaWYgKGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgJ2hhbmRsZScsIHtcbiAgICAgICAgICAgIHZhbHVlOiBoLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIEFsd2F5cyBwb3B1bGF0ZSBhIHJlbGF0aXZlIHBhdGggc28gdGhhdCBldmVuIGVsZWN0cm9uIGFwcHMgaGF2ZSBhY2Nlc3MgdG8gYSByZWxhdGl2ZVBhdGggdmFsdWVcbiAgICBzZXRPYmpQcm9wKGYsICdyZWxhdGl2ZVBhdGgnLCBwKTtcbiAgICByZXR1cm4gZjtcbn1cbmZ1bmN0aW9uIHdpdGhNaW1lVHlwZShmaWxlKSB7XG4gICAgdmFyIG5hbWUgPSBmaWxlLm5hbWU7XG4gICAgdmFyIGhhc0V4dGVuc2lvbiA9IG5hbWUgJiYgbmFtZS5sYXN0SW5kZXhPZignLicpICE9PSAtMTtcbiAgICBpZiAoaGFzRXh0ZW5zaW9uICYmICFmaWxlLnR5cGUpIHtcbiAgICAgICAgdmFyIGV4dCA9IG5hbWUuc3BsaXQoJy4nKVxuICAgICAgICAgICAgLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHZhciB0eXBlID0gZXhwb3J0cy5DT01NT05fTUlNRV9UWVBFUy5nZXQoZXh0KTtcbiAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlLCAndHlwZScsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdHlwZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlsZTtcbn1cbmZ1bmN0aW9uIHNldE9ialByb3AoZiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fcmVhZCA9ICh0aGlzICYmIHRoaXMuX19yZWFkKSB8fCBmdW5jdGlvbiAobywgbikge1xuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcbiAgICBpZiAoIW0pIHJldHVybiBvO1xuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xuICAgIHRyeSB7XG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxuICAgIH1cbiAgICByZXR1cm4gYXI7XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5mcm9tRXZlbnQgPSBmcm9tRXZlbnQ7XG52YXIgZmlsZV8xID0gcmVxdWlyZShcIi4vZmlsZVwiKTtcbnZhciBGSUxFU19UT19JR05PUkUgPSBbXG4gICAgLy8gVGh1bWJuYWlsIGNhY2hlIGZpbGVzIGZvciBtYWNPUyBhbmQgV2luZG93c1xuICAgICcuRFNfU3RvcmUnLCAvLyBtYWNPc1xuICAgICdUaHVtYnMuZGInIC8vIFdpbmRvd3Ncbl07XG4vKipcbiAqIENvbnZlcnQgYSBEcmFnRXZlbnQncyBEYXRhVHJhc2ZlciBvYmplY3QgdG8gYSBsaXN0IG9mIEZpbGUgb2JqZWN0c1xuICogTk9URTogSWYgc29tZSBvZiB0aGUgaXRlbXMgYXJlIGZvbGRlcnMsXG4gKiBldmVyeXRoaW5nIHdpbGwgYmUgZmxhdHRlbmVkIGFuZCBwbGFjZWQgaW4gdGhlIHNhbWUgbGlzdCBidXQgdGhlIHBhdGhzIHdpbGwgYmUga2VwdCBhcyBhIHtwYXRofSBwcm9wZXJ0eS5cbiAqXG4gKiBFWFBFUklNRU5UQUw6IEEgbGlzdCBvZiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbUhhbmRsZSBvYmplY3RzIGNhbiBhbHNvIGJlIHBhc3NlZCBhcyBhbiBhcmdcbiAqIGFuZCBhIGxpc3Qgb2YgRmlsZSBvYmplY3RzIHdpbGwgYmUgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIGV2dFxuICovXG5mdW5jdGlvbiBmcm9tRXZlbnQoZXZ0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoZXZ0KSAmJiBpc0RhdGFUcmFuc2ZlcihldnQuZGF0YVRyYW5zZmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBnZXREYXRhVHJhbnNmZXJGaWxlcyhldnQuZGF0YVRyYW5zZmVyLCBldnQudHlwZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNDaGFuZ2VFdnQoZXZ0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBnZXRJbnB1dEZpbGVzKGV2dCldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShldnQpICYmIGV2dC5ldmVyeShmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gJ2dldEZpbGUnIGluIGl0ZW0gJiYgdHlwZW9mIGl0ZW0uZ2V0RmlsZSA9PT0gJ2Z1bmN0aW9uJzsgfSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZ2V0RnNIYW5kbGVGaWxlcyhldnQpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBbXV07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gaXNEYXRhVHJhbnNmZXIodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3QodmFsdWUpO1xufVxuZnVuY3Rpb24gaXNDaGFuZ2VFdnQodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIGlzT2JqZWN0KHZhbHVlLnRhcmdldCk7XG59XG5mdW5jdGlvbiBpc09iamVjdCh2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09PSAnb2JqZWN0JyAmJiB2ICE9PSBudWxsO1xufVxuZnVuY3Rpb24gZ2V0SW5wdXRGaWxlcyhldnQpIHtcbiAgICByZXR1cm4gZnJvbUxpc3QoZXZ0LnRhcmdldC5maWxlcykubWFwKGZ1bmN0aW9uIChmaWxlKSB7IHJldHVybiAoMCwgZmlsZV8xLnRvRmlsZVdpdGhQYXRoKShmaWxlKTsgfSk7XG59XG4vLyBFZSBleHBlY3QgZWFjaCBoYW5kbGUgdG8gYmUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1GaWxlSGFuZGxlXG5mdW5jdGlvbiBnZXRGc0hhbmRsZUZpbGVzKGhhbmRsZXMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmaWxlcztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgUHJvbWlzZS5hbGwoaGFuZGxlcy5tYXAoZnVuY3Rpb24gKGgpIHsgcmV0dXJuIGguZ2V0RmlsZSgpOyB9KSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBmaWxlcy5tYXAoZnVuY3Rpb24gKGZpbGUpIHsgcmV0dXJuICgwLCBmaWxlXzEudG9GaWxlV2l0aFBhdGgpKGZpbGUpOyB9KV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0RGF0YVRyYW5zZmVyRmlsZXMoZHQsIHR5cGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpdGVtcywgZmlsZXM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGlmICghZHQuaXRlbXMpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IGZyb21MaXN0KGR0Lml0ZW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbS5raW5kID09PSAnZmlsZSc7IH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBBY2NvcmRpbmcgdG8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZG5kLmh0bWwjZG5kZXZlbnRzLFxuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5ICdkcmFnc3RhcnQnIGFuZCAnZHJvcCcgaGFzIGFjY2VzcyB0byB0aGUgZGF0YSAoc291cmNlIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlICE9PSAnZHJvcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBpdGVtc107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgUHJvbWlzZS5hbGwoaXRlbXMubWFwKHRvRmlsZVByb21pc2VzKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBub0lnbm9yZWRGaWxlcyhmbGF0dGVuKGZpbGVzKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5vSWdub3JlZEZpbGVzKGZyb21MaXN0KGR0LmZpbGVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoZmlsZSkgeyByZXR1cm4gKDAsIGZpbGVfMS50b0ZpbGVXaXRoUGF0aCkoZmlsZSk7IH0pKV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbm9JZ25vcmVkRmlsZXMoZmlsZXMpIHtcbiAgICByZXR1cm4gZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7IHJldHVybiBGSUxFU19UT19JR05PUkUuaW5kZXhPZihmaWxlLm5hbWUpID09PSAtMTsgfSk7XG59XG4vLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgQXJyYXkuZnJvbSgpXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mcm9tI0Jyb3dzZXJfY29tcGF0aWJpbGl0eVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVMaXN0XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRGF0YVRyYW5zZmVySXRlbUxpc3RcbmZ1bmN0aW9uIGZyb21MaXN0KGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgdmFyIGZpbGVzID0gW107XG4gICAgLy8gdHNsaW50OmRpc2FibGU6IHByZWZlci1mb3Itb2ZcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmaWxlID0gaXRlbXNbaV07XG4gICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgfVxuICAgIHJldHVybiBmaWxlcztcbn1cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EYXRhVHJhbnNmZXJJdGVtXG5mdW5jdGlvbiB0b0ZpbGVQcm9taXNlcyhpdGVtKSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtLndlYmtpdEdldEFzRW50cnkgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGZyb21EYXRhVHJhbnNmZXJJdGVtKGl0ZW0pO1xuICAgIH1cbiAgICB2YXIgZW50cnkgPSBpdGVtLndlYmtpdEdldEFzRW50cnkoKTtcbiAgICAvLyBTYWZhcmkgc3VwcG9ydHMgZHJvcHBpbmcgYW4gaW1hZ2Ugbm9kZSBmcm9tIGEgZGlmZmVyZW50IHdpbmRvdyBhbmQgY2FuIGJlIHJldHJpZXZlZCB1c2luZ1xuICAgIC8vIHRoZSBEYXRhVHJhbnNmZXJJdGVtLmdldEFzRmlsZSgpIEFQSVxuICAgIC8vIE5PVEU6IEZpbGVTeXN0ZW1FbnRyeS5maWxlKCkgdGhyb3dzIGlmIHRyeWluZyB0byBnZXQgdGhlIGZpbGVcbiAgICBpZiAoZW50cnkgJiYgZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgcmV0dXJuIGZyb21EaXJFbnRyeShlbnRyeSk7XG4gICAgfVxuICAgIHJldHVybiBmcm9tRGF0YVRyYW5zZmVySXRlbShpdGVtLCBlbnRyeSk7XG59XG5mdW5jdGlvbiBmbGF0dGVuKGl0ZW1zKSB7XG4gICAgcmV0dXJuIGl0ZW1zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBmaWxlcykgeyByZXR1cm4gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYWNjKSwgZmFsc2UpLCBfX3JlYWQoKEFycmF5LmlzQXJyYXkoZmlsZXMpID8gZmxhdHRlbihmaWxlcykgOiBbZmlsZXNdKSksIGZhbHNlKTsgfSwgW10pO1xufVxuZnVuY3Rpb24gZnJvbURhdGFUcmFuc2Zlckl0ZW0oaXRlbSwgZW50cnkpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoLCBmaWxlXzIsIGZpbGUsIGZ3cDtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShnbG9iYWxUaGlzLmlzU2VjdXJlQ29udGV4dCAmJiB0eXBlb2YgaXRlbS5nZXRBc0ZpbGVTeXN0ZW1IYW5kbGUgPT09ICdmdW5jdGlvbicpKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgaXRlbS5nZXRBc0ZpbGVTeXN0ZW1IYW5kbGUoKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBoID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCIuY29uY2F0KGl0ZW0sIFwiIGlzIG5vdCBhIEZpbGVcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGggIT09IHVuZGVmaW5lZCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBoLmdldEZpbGUoKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBmaWxlXzIgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVfMi5oYW5kbGUgPSBoO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgKDAsIGZpbGVfMS50b0ZpbGVXaXRoUGF0aCkoZmlsZV8yKV07XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBmaWxlID0gaXRlbS5nZXRBc0ZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIi5jb25jYXQoaXRlbSwgXCIgaXMgbm90IGEgRmlsZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZndwID0gKDAsIGZpbGVfMS50b0ZpbGVXaXRoUGF0aCkoZmlsZSwgKF9hID0gZW50cnkgPT09IG51bGwgfHwgZW50cnkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudHJ5LmZ1bGxQYXRoKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZndwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbUVudHJ5XG5mdW5jdGlvbiBmcm9tRW50cnkoZW50cnkpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBlbnRyeS5pc0RpcmVjdG9yeSA/IGZyb21EaXJFbnRyeShlbnRyeSkgOiBmcm9tRmlsZUVudHJ5KGVudHJ5KV07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1EaXJlY3RvcnlFbnRyeVxuZnVuY3Rpb24gZnJvbURpckVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlYWRlciA9IGVudHJ5LmNyZWF0ZVJlYWRlcigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHJlYWRFbnRyaWVzKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRGlyZWN0b3J5RW50cnkvY3JlYXRlUmVhZGVyXG4gICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbURpcmVjdG9yeVJlYWRlci9yZWFkRW50cmllc1xuICAgICAgICAgICAgcmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uIChiYXRjaCkgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBmaWxlcywgZXJyXzEsIGl0ZW1zO1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIWJhdGNoLmxlbmd0aCkgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgUHJvbWlzZS5hbGwoZW50cmllcyldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gUHJvbWlzZS5hbGwoYmF0Y2gubWFwKGZyb21FbnRyeSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaChpdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgcmVhZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSA2O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZWFkRW50cmllcygpO1xuICAgIH0pO1xufVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1GaWxlRW50cnlcbmZ1bmN0aW9uIGZyb21GaWxlRW50cnkoZW50cnkpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmd3AgPSAoMCwgZmlsZV8xLnRvRmlsZVdpdGhQYXRoKShmaWxlLCBlbnRyeS5mdWxsUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZ3cCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsZS1zZWxlY3Rvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZnJvbUV2ZW50ID0gdm9pZCAwO1xudmFyIGZpbGVfc2VsZWN0b3JfMSA9IHJlcXVpcmUoXCIuL2ZpbGUtc2VsZWN0b3JcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJmcm9tRXZlbnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZpbGVfc2VsZWN0b3JfMS5mcm9tRXZlbnQ7IH0gfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihlKXt2YXIgcj17fTtmdW5jdGlvbiB0KG4pe2lmKHJbbl0pcmV0dXJuIHJbbl0uZXhwb3J0czt2YXIgbz1yW25dPXtpOm4sbDohMSxleHBvcnRzOnt9fTtyZXR1cm4gZVtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyx0KSxvLmw9ITAsby5leHBvcnRzfXJldHVybiB0Lm09ZSx0LmM9cix0LmQ9ZnVuY3Rpb24oZSxyLG4pe3QubyhlLHIpfHxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxyLHtlbnVtZXJhYmxlOiEwLGdldDpufSl9LHQucj1mdW5jdGlvbihlKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSx0LnQ9ZnVuY3Rpb24oZSxyKXtpZigxJnImJihlPXQoZSkpLDgmcilyZXR1cm4gZTtpZig0JnImJlwib2JqZWN0XCI9PXR5cGVvZiBlJiZlJiZlLl9fZXNNb2R1bGUpcmV0dXJuIGU7dmFyIG49T2JqZWN0LmNyZWF0ZShudWxsKTtpZih0LnIobiksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJkZWZhdWx0XCIse2VudW1lcmFibGU6ITAsdmFsdWU6ZX0pLDImciYmXCJzdHJpbmdcIiE9dHlwZW9mIGUpZm9yKHZhciBvIGluIGUpdC5kKG4sbyxmdW5jdGlvbihyKXtyZXR1cm4gZVtyXX0uYmluZChudWxsLG8pKTtyZXR1cm4gbn0sdC5uPWZ1bmN0aW9uKGUpe3ZhciByPWUmJmUuX19lc01vZHVsZT9mdW5jdGlvbigpe3JldHVybiBlLmRlZmF1bHR9OmZ1bmN0aW9uKCl7cmV0dXJuIGV9O3JldHVybiB0LmQocixcImFcIixyKSxyfSx0Lm89ZnVuY3Rpb24oZSxyKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUscil9LHQucD1cIlwiLHQodC5zPTApfShbZnVuY3Rpb24oZSxyLHQpe1widXNlIHN0cmljdFwiO3IuX19lc01vZHVsZT0hMCxyLmRlZmF1bHQ9ZnVuY3Rpb24oZSxyKXtpZihlJiZyKXt2YXIgdD1BcnJheS5pc0FycmF5KHIpP3I6ci5zcGxpdChcIixcIik7aWYoMD09PXQubGVuZ3RoKXJldHVybiEwO3ZhciBuPWUubmFtZXx8XCJcIixvPShlLnR5cGV8fFwiXCIpLnRvTG93ZXJDYXNlKCksdT1vLnJlcGxhY2UoL1xcLy4qJC8sXCJcIik7cmV0dXJuIHQuc29tZSgoZnVuY3Rpb24oZSl7dmFyIHI9ZS50cmltKCkudG9Mb3dlckNhc2UoKTtyZXR1cm5cIi5cIj09PXIuY2hhckF0KDApP24udG9Mb3dlckNhc2UoKS5lbmRzV2l0aChyKTpyLmVuZHNXaXRoKFwiLypcIik/dT09PXIucmVwbGFjZSgvXFwvLiokLyxcIlwiKTpvPT09cn0pKX1yZXR1cm4hMH19XSk7IiwiZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KGFycik7IH1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGVudW1lcmFibGVPbmx5ICYmIChzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSkpLCBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7IH0gcmV0dXJuIGtleXM7IH1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307IGkgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgITApLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH0sIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl07IGlmIChfaSA9PSBudWxsKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX3MsIF9lOyB0cnkgeyBmb3IgKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmltcG9ydCBfYWNjZXB0cyBmcm9tIFwiYXR0ci1hY2NlcHRcIjtcbnZhciBhY2NlcHRzID0gdHlwZW9mIF9hY2NlcHRzID09PSBcImZ1bmN0aW9uXCIgPyBfYWNjZXB0cyA6IF9hY2NlcHRzLmRlZmF1bHQ7IC8vIEVycm9yIGNvZGVzXG5cbmV4cG9ydCB2YXIgRklMRV9JTlZBTElEX1RZUEUgPSBcImZpbGUtaW52YWxpZC10eXBlXCI7XG5leHBvcnQgdmFyIEZJTEVfVE9PX0xBUkdFID0gXCJmaWxlLXRvby1sYXJnZVwiO1xuZXhwb3J0IHZhciBGSUxFX1RPT19TTUFMTCA9IFwiZmlsZS10b28tc21hbGxcIjtcbmV4cG9ydCB2YXIgVE9PX01BTllfRklMRVMgPSBcInRvby1tYW55LWZpbGVzXCI7XG5leHBvcnQgdmFyIEVycm9yQ29kZSA9IHtcbiAgRmlsZUludmFsaWRUeXBlOiBGSUxFX0lOVkFMSURfVFlQRSxcbiAgRmlsZVRvb0xhcmdlOiBGSUxFX1RPT19MQVJHRSxcbiAgRmlsZVRvb1NtYWxsOiBGSUxFX1RPT19TTUFMTCxcbiAgVG9vTWFueUZpbGVzOiBUT09fTUFOWV9GSUxFU1xufTtcbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY2NlcHRcbiAqL1xuXG5leHBvcnQgdmFyIGdldEludmFsaWRUeXBlUmVqZWN0aW9uRXJyID0gZnVuY3Rpb24gZ2V0SW52YWxpZFR5cGVSZWplY3Rpb25FcnIoKSB7XG4gIHZhciBhY2NlcHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFwiXCI7XG4gIHZhciBhY2NlcHRBcnIgPSBhY2NlcHQuc3BsaXQoXCIsXCIpO1xuICB2YXIgbXNnID0gYWNjZXB0QXJyLmxlbmd0aCA+IDEgPyBcIm9uZSBvZiBcIi5jb25jYXQoYWNjZXB0QXJyLmpvaW4oXCIsIFwiKSkgOiBhY2NlcHRBcnJbMF07XG4gIHJldHVybiB7XG4gICAgY29kZTogRklMRV9JTlZBTElEX1RZUEUsXG4gICAgbWVzc2FnZTogXCJGaWxlIHR5cGUgbXVzdCBiZSBcIi5jb25jYXQobXNnKVxuICB9O1xufTtcbmV4cG9ydCB2YXIgZ2V0VG9vTGFyZ2VSZWplY3Rpb25FcnIgPSBmdW5jdGlvbiBnZXRUb29MYXJnZVJlamVjdGlvbkVycihtYXhTaXplKSB7XG4gIHJldHVybiB7XG4gICAgY29kZTogRklMRV9UT09fTEFSR0UsXG4gICAgbWVzc2FnZTogXCJGaWxlIGlzIGxhcmdlciB0aGFuIFwiLmNvbmNhdChtYXhTaXplLCBcIiBcIikuY29uY2F0KG1heFNpemUgPT09IDEgPyBcImJ5dGVcIiA6IFwiYnl0ZXNcIilcbiAgfTtcbn07XG5leHBvcnQgdmFyIGdldFRvb1NtYWxsUmVqZWN0aW9uRXJyID0gZnVuY3Rpb24gZ2V0VG9vU21hbGxSZWplY3Rpb25FcnIobWluU2l6ZSkge1xuICByZXR1cm4ge1xuICAgIGNvZGU6IEZJTEVfVE9PX1NNQUxMLFxuICAgIG1lc3NhZ2U6IFwiRmlsZSBpcyBzbWFsbGVyIHRoYW4gXCIuY29uY2F0KG1pblNpemUsIFwiIFwiKS5jb25jYXQobWluU2l6ZSA9PT0gMSA/IFwiYnl0ZVwiIDogXCJieXRlc1wiKVxuICB9O1xufTtcbmV4cG9ydCB2YXIgVE9PX01BTllfRklMRVNfUkVKRUNUSU9OID0ge1xuICBjb2RlOiBUT09fTUFOWV9GSUxFUyxcbiAgbWVzc2FnZTogXCJUb28gbWFueSBmaWxlc1wiXG59O1xuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZmlsZSBpcyBhIERhdGFUcmFuc2Zlckl0ZW0gd2l0aCBhbiBlbXB0eSB0eXBlLlxuICpcbiAqIER1cmluZyBkcmFnIGV2ZW50cywgYnJvd3NlcnMgbWF5IHJldHVybiBEYXRhVHJhbnNmZXJJdGVtIG9iamVjdHMgaW5zdGVhZCBvZiBGaWxlIG9iamVjdHMuXG4gKiBTb21lIGJyb3dzZXJzIChlLmcuLCBDaHJvbWUpIHJldHVybiBhbiBlbXB0eSBNSU1FIHR5cGUgZm9yIGNlcnRhaW4gZmlsZSB0eXBlcyAobGlrZSAubWQgZmlsZXMpXG4gKiBvbiBEYXRhVHJhbnNmZXJJdGVtIGR1cmluZyBkcmFnIGV2ZW50cywgZXZlbiB0aG91Z2ggdGhlIHR5cGUgaXMgY29ycmVjdGx5IHNldCBkdXJpbmcgZHJvcC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGRldGVjdHMgc3VjaCBjYXNlcyBieSBjaGVja2luZyBmb3I6XG4gKiAxLiBFbXB0eSB0eXBlIHN0cmluZ1xuICogMi4gUHJlc2VuY2Ugb2YgZ2V0QXNGaWxlIG1ldGhvZCAoaW5kaWNhdGVzIGl0J3MgYSBEYXRhVHJhbnNmZXJJdGVtLCBub3QgYSBGaWxlKVxuICpcbiAqIFdlIGFjY2VwdCB0aGVzZSBkdXJpbmcgZHJhZyB0byBwcm92aWRlIHByb3BlciBVSSBmZWVkYmFjaywgd2hpbGUgbWFpbnRhaW5pbmdcbiAqIHN0cmljdCB2YWxpZGF0aW9uIGR1cmluZyBkcm9wIHdoZW4gcmVhbCBGaWxlIG9iamVjdHMgYXJlIGF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge0ZpbGUgfCBEYXRhVHJhbnNmZXJJdGVtfSBmaWxlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhVHJhbnNmZXJJdGVtV2l0aEVtcHR5VHlwZShmaWxlKSB7XG4gIHJldHVybiBmaWxlLnR5cGUgPT09IFwiXCIgJiYgdHlwZW9mIGZpbGUuZ2V0QXNGaWxlID09PSBcImZ1bmN0aW9uXCI7XG59XG4vKipcbiAqIENoZWNrIGlmIGZpbGUgaXMgYWNjZXB0ZWQuXG4gKlxuICogRmlyZWZveCB2ZXJzaW9ucyBwcmlvciB0byA1MyByZXR1cm4gYSBib2d1cyBNSU1FIHR5cGUgZm9yIGV2ZXJ5IGZpbGUgZHJhZyxcbiAqIHNvIGRyYWdvdmVycyB3aXRoIHRoYXQgTUlNRSB0eXBlIHdpbGwgYWx3YXlzIGJlIGFjY2VwdGVkLlxuICpcbiAqIENocm9tZS9vdGhlciBicm93c2VycyBtYXkgcmV0dXJuIGFuIGVtcHR5IE1JTUUgdHlwZSBmb3IgZmlsZXMgZHVyaW5nIGRyYWcgZXZlbnRzLFxuICogc28gd2UgYWNjZXB0IHRob3NlIGFzIHdlbGwgKHdlJ2xsIHZhbGlkYXRlIHByb3Blcmx5IG9uIGRyb3ApLlxuICpcbiAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICogQHBhcmFtIHtzdHJpbmd9IGFjY2VwdFxuICogQHJldHVybnNcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsZUFjY2VwdGVkKGZpbGUsIGFjY2VwdCkge1xuICB2YXIgaXNBY2NlcHRhYmxlID0gZmlsZS50eXBlID09PSBcImFwcGxpY2F0aW9uL3gtbW96LWZpbGVcIiB8fCBhY2NlcHRzKGZpbGUsIGFjY2VwdCkgfHwgaXNEYXRhVHJhbnNmZXJJdGVtV2l0aEVtcHR5VHlwZShmaWxlKTtcbiAgcmV0dXJuIFtpc0FjY2VwdGFibGUsIGlzQWNjZXB0YWJsZSA/IG51bGwgOiBnZXRJbnZhbGlkVHlwZVJlamVjdGlvbkVycihhY2NlcHQpXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaWxlTWF0Y2hTaXplKGZpbGUsIG1pblNpemUsIG1heFNpemUpIHtcbiAgaWYgKGlzRGVmaW5lZChmaWxlLnNpemUpKSB7XG4gICAgaWYgKGlzRGVmaW5lZChtaW5TaXplKSAmJiBpc0RlZmluZWQobWF4U2l6ZSkpIHtcbiAgICAgIGlmIChmaWxlLnNpemUgPiBtYXhTaXplKSByZXR1cm4gW2ZhbHNlLCBnZXRUb29MYXJnZVJlamVjdGlvbkVycihtYXhTaXplKV07XG4gICAgICBpZiAoZmlsZS5zaXplIDwgbWluU2l6ZSkgcmV0dXJuIFtmYWxzZSwgZ2V0VG9vU21hbGxSZWplY3Rpb25FcnIobWluU2l6ZSldO1xuICAgIH0gZWxzZSBpZiAoaXNEZWZpbmVkKG1pblNpemUpICYmIGZpbGUuc2l6ZSA8IG1pblNpemUpIHJldHVybiBbZmFsc2UsIGdldFRvb1NtYWxsUmVqZWN0aW9uRXJyKG1pblNpemUpXTtlbHNlIGlmIChpc0RlZmluZWQobWF4U2l6ZSkgJiYgZmlsZS5zaXplID4gbWF4U2l6ZSkgcmV0dXJuIFtmYWxzZSwgZ2V0VG9vTGFyZ2VSZWplY3Rpb25FcnIobWF4U2l6ZSldO1xuICB9XG5cbiAgcmV0dXJuIFt0cnVlLCBudWxsXTtcbn1cblxuZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RmlsZVtdfSBvcHRpb25zLmZpbGVzXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYWNjZXB0XVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1pblNpemVdXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4U2l6ZV1cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubXVsdGlwbGVdXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4RmlsZXNdXG4gKiBAcGFyYW0geyhmOiBGaWxlKSA9PiBGaWxlRXJyb3J8RmlsZUVycm9yW118bnVsbH0gW29wdGlvbnMudmFsaWRhdG9yXVxuICogQHJldHVybnNcbiAqL1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxGaWxlc0FjY2VwdGVkKF9yZWYpIHtcbiAgdmFyIGZpbGVzID0gX3JlZi5maWxlcyxcbiAgICAgIGFjY2VwdCA9IF9yZWYuYWNjZXB0LFxuICAgICAgbWluU2l6ZSA9IF9yZWYubWluU2l6ZSxcbiAgICAgIG1heFNpemUgPSBfcmVmLm1heFNpemUsXG4gICAgICBtdWx0aXBsZSA9IF9yZWYubXVsdGlwbGUsXG4gICAgICBtYXhGaWxlcyA9IF9yZWYubWF4RmlsZXMsXG4gICAgICB2YWxpZGF0b3IgPSBfcmVmLnZhbGlkYXRvcjtcblxuICBpZiAoIW11bHRpcGxlICYmIGZpbGVzLmxlbmd0aCA+IDEgfHwgbXVsdGlwbGUgJiYgbWF4RmlsZXMgPj0gMSAmJiBmaWxlcy5sZW5ndGggPiBtYXhGaWxlcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBmaWxlcy5ldmVyeShmdW5jdGlvbiAoZmlsZSkge1xuICAgIHZhciBfZmlsZUFjY2VwdGVkID0gZmlsZUFjY2VwdGVkKGZpbGUsIGFjY2VwdCksXG4gICAgICAgIF9maWxlQWNjZXB0ZWQyID0gX3NsaWNlZFRvQXJyYXkoX2ZpbGVBY2NlcHRlZCwgMSksXG4gICAgICAgIGFjY2VwdGVkID0gX2ZpbGVBY2NlcHRlZDJbMF07XG5cbiAgICB2YXIgX2ZpbGVNYXRjaFNpemUgPSBmaWxlTWF0Y2hTaXplKGZpbGUsIG1pblNpemUsIG1heFNpemUpLFxuICAgICAgICBfZmlsZU1hdGNoU2l6ZTIgPSBfc2xpY2VkVG9BcnJheShfZmlsZU1hdGNoU2l6ZSwgMSksXG4gICAgICAgIHNpemVNYXRjaCA9IF9maWxlTWF0Y2hTaXplMlswXTtcblxuICAgIHZhciBjdXN0b21FcnJvcnMgPSB2YWxpZGF0b3IgPyB2YWxpZGF0b3IoZmlsZSkgOiBudWxsO1xuICAgIHJldHVybiBhY2NlcHRlZCAmJiBzaXplTWF0Y2ggJiYgIWN1c3RvbUVycm9ycztcbiAgfSk7XG59IC8vIFJlYWN0J3Mgc3ludGhldGljIGV2ZW50cyBoYXMgZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQsXG4vLyBidXQgdG8gcmVtYWluIGNvbXBhdGliaWxpdHkgd2l0aCBvdGhlciBsaWJzIChQcmVhY3QpIGZhbGwgYmFja1xuLy8gdG8gY2hlY2sgZXZlbnQuY2FuY2VsQnViYmxlXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCkge1xuICBpZiAodHlwZW9mIGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXZlbnQuY2FuY2VsQnViYmxlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIGV2ZW50LmNhbmNlbEJ1YmJsZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0V2dFdpdGhGaWxlcyhldmVudCkge1xuICBpZiAoIWV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgIHJldHVybiAhIWV2ZW50LnRhcmdldCAmJiAhIWV2ZW50LnRhcmdldC5maWxlcztcbiAgfSAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRGF0YVRyYW5zZmVyL3R5cGVzXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MX0RyYWdfYW5kX0Ryb3BfQVBJL1JlY29tbWVuZGVkX2RyYWdfdHlwZXMjZmlsZVxuXG5cbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwoZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0eXBlID09PSBcIkZpbGVzXCIgfHwgdHlwZSA9PT0gXCJhcHBsaWNhdGlvbi94LW1vei1maWxlXCI7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzS2luZEZpbGUoaXRlbSkge1xuICByZXR1cm4gX3R5cGVvZihpdGVtKSA9PT0gXCJvYmplY3RcIiAmJiBpdGVtICE9PSBudWxsICYmIGl0ZW0ua2luZCA9PT0gXCJmaWxlXCI7XG59IC8vIGFsbG93IHRoZSBlbnRpcmUgZG9jdW1lbnQgdG8gYmUgYSBkcmFnIHRhcmdldFxuXG5leHBvcnQgZnVuY3Rpb24gb25Eb2N1bWVudERyYWdPdmVyKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIGlzSWUodXNlckFnZW50KSB7XG4gIHJldHVybiB1c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgIT09IC0xIHx8IHVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudC9cIikgIT09IC0xO1xufVxuXG5mdW5jdGlvbiBpc0VkZ2UodXNlckFnZW50KSB7XG4gIHJldHVybiB1c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2UvXCIpICE9PSAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSWVPckVkZ2UoKSB7XG4gIHZhciB1c2VyQWdlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4gaXNJZSh1c2VyQWdlbnQpIHx8IGlzRWRnZSh1c2VyQWdlbnQpO1xufVxuLyoqXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgdG8gY29tcG9zZSBldmVudCBoYW5kbGVyc1xuICogVGhleSBhcmUgZXhlY3V0ZWQgaW4gb3JkZXIgdW50aWwgb25lIG9mIHRoZW0gY2FsbHMgYGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKClgLlxuICogTm90ZSB0aGF0IHRoZSBjaGVjayBpcyBkb25lIG9uIHRoZSBmaXJzdCBpbnZva2UgdG9vLFxuICogbWVhbmluZyB0aGF0IGlmIHByb3BhZ2F0aW9uIHdhcyBzdG9wcGVkIGJlZm9yZSBpbnZva2luZyB0aGUgZm5zLFxuICogbm8gaGFuZGxlcnMgd2lsbCBiZSBleGVjdXRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbnMgdGhlIGV2ZW50IGhhbmxkZXIgZnVuY3Rpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGV2ZW50IGhhbmRsZXIgdG8gYWRkIHRvIGFuIGVsZW1lbnRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZUV2ZW50SGFuZGxlcnMoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZm5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiBmbnMuc29tZShmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICghaXNQcm9wYWdhdGlvblN0b3BwZWQoZXZlbnQpICYmIGZuKSB7XG4gICAgICAgIGZuLmFwcGx5KHZvaWQgMCwgW2V2ZW50XS5jb25jYXQoYXJncykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNQcm9wYWdhdGlvblN0b3BwZWQoZXZlbnQpO1xuICAgIH0pO1xuICB9O1xufVxuLyoqXG4gKiBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJIGNoZWNrcyBpZiB0aGUgW0ZpbGUgU3lzdGVtIEFjY2VzcyBBUEldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlX1N5c3RlbV9BY2Nlc3NfQVBJKVxuICogaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZUZpbGVTeXN0ZW1BY2Nlc3NBUEkoKSB7XG4gIHJldHVybiBcInNob3dPcGVuRmlsZVBpY2tlclwiIGluIHdpbmRvdztcbn1cbi8qKlxuICogQ29udmVydCB0aGUgYHthY2NlcHR9YCBkcm9wem9uZSBwcm9wIHRvIHRoZVxuICogYHt0eXBlc31gIG9wdGlvbiBmb3IgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9zaG93T3BlbkZpbGVQaWNrZXJcbiAqXG4gKiBAcGFyYW0ge0FjY2VwdFByb3B9IGFjY2VwdFxuICogQHJldHVybnMge3thY2NlcHQ6IHN0cmluZ1tdfVtdfVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrZXJPcHRpb25zRnJvbUFjY2VwdChhY2NlcHQpIHtcbiAgaWYgKGlzRGVmaW5lZChhY2NlcHQpKSB7XG4gICAgdmFyIGFjY2VwdEZvclBpY2tlciA9IE9iamVjdC5lbnRyaWVzKGFjY2VwdCkuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIF9yZWYzID0gX3NsaWNlZFRvQXJyYXkoX3JlZjIsIDIpLFxuICAgICAgICAgIG1pbWVUeXBlID0gX3JlZjNbMF0sXG4gICAgICAgICAgZXh0ID0gX3JlZjNbMV07XG5cbiAgICAgIHZhciBvayA9IHRydWU7XG5cbiAgICAgIGlmICghaXNNSU1FVHlwZShtaW1lVHlwZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiU2tpcHBlZCBcXFwiXCIuY29uY2F0KG1pbWVUeXBlLCBcIlxcXCIgYmVjYXVzZSBpdCBpcyBub3QgYSB2YWxpZCBNSU1FIHR5cGUuIENoZWNrIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUVFAvQmFzaWNzX29mX0hUVFAvTUlNRV90eXBlcy9Db21tb25fdHlwZXMgZm9yIGEgbGlzdCBvZiB2YWxpZCBNSU1FIHR5cGVzLlwiKSk7XG4gICAgICAgIG9rID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShleHQpIHx8ICFleHQuZXZlcnkoaXNFeHQpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlNraXBwZWQgXFxcIlwiLmNvbmNhdChtaW1lVHlwZSwgXCJcXFwiIGJlY2F1c2UgYW4gaW52YWxpZCBmaWxlIGV4dGVuc2lvbiB3YXMgcHJvdmlkZWQuXCIpKTtcbiAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9rO1xuICAgIH0pLnJlZHVjZShmdW5jdGlvbiAoYWdnLCBfcmVmNCkge1xuICAgICAgdmFyIF9yZWY1ID0gX3NsaWNlZFRvQXJyYXkoX3JlZjQsIDIpLFxuICAgICAgICAgIG1pbWVUeXBlID0gX3JlZjVbMF0sXG4gICAgICAgICAgZXh0ID0gX3JlZjVbMV07XG5cbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIGFnZyksIHt9LCBfZGVmaW5lUHJvcGVydHkoe30sIG1pbWVUeXBlLCBleHQpKTtcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIFt7XG4gICAgICAvLyBkZXNjcmlwdGlvbiBpcyByZXF1aXJlZCBkdWUgdG8gaHR0cHM6Ly9jcmJ1Zy5jb20vMTI2NDcwOFxuICAgICAgZGVzY3JpcHRpb246IFwiRmlsZXNcIixcbiAgICAgIGFjY2VwdDogYWNjZXB0Rm9yUGlja2VyXG4gICAgfV07XG4gIH1cblxuICByZXR1cm4gYWNjZXB0O1xufVxuLyoqXG4gKiBDb252ZXJ0IHRoZSBge2FjY2VwdH1gIGRyb3B6b25lIHByb3AgdG8gYW4gYXJyYXkgb2YgTUlNRSB0eXBlcy9leHRlbnNpb25zLlxuICogQHBhcmFtIHtBY2NlcHRQcm9wfSBhY2NlcHRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFjY2VwdFByb3BBc0FjY2VwdEF0dHIoYWNjZXB0KSB7XG4gIGlmIChpc0RlZmluZWQoYWNjZXB0KSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhhY2NlcHQpLnJlZHVjZShmdW5jdGlvbiAoYSwgX3JlZjYpIHtcbiAgICAgIHZhciBfcmVmNyA9IF9zbGljZWRUb0FycmF5KF9yZWY2LCAyKSxcbiAgICAgICAgICBtaW1lVHlwZSA9IF9yZWY3WzBdLFxuICAgICAgICAgIGV4dCA9IF9yZWY3WzFdO1xuXG4gICAgICByZXR1cm4gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShhKSwgW21pbWVUeXBlXSwgX3RvQ29uc3VtYWJsZUFycmF5KGV4dCkpO1xuICAgIH0sIFtdKSAvLyBTaWxlbnRseSBkaXNjYXJkIGludmFsaWQgZW50cmllcyBhcyBwaWNrZXJPcHRpb25zRnJvbUFjY2VwdCB3YXJucyBhYm91dCB0aGVzZVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiBpc01JTUVUeXBlKHYpIHx8IGlzRXh0KHYpO1xuICAgIH0pLmpvaW4oXCIsXCIpO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbi8qKlxuICogQ2hlY2sgaWYgdiBpcyBhbiBleGNlcHRpb24gY2F1c2VkIGJ5IGFib3J0aW5nIGEgcmVxdWVzdCAoZS5nIHdpbmRvdy5zaG93T3BlbkZpbGVQaWNrZXIoKSkuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01FeGNlcHRpb24uXG4gKiBAcGFyYW0ge2FueX0gdlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdiBpcyBhbiBhYm9ydCBleGNlcHRpb24uXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWJvcnQodikge1xuICByZXR1cm4gdiBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbiAmJiAodi5uYW1lID09PSBcIkFib3J0RXJyb3JcIiB8fCB2LmNvZGUgPT09IHYuQUJPUlRfRVJSKTtcbn1cbi8qKlxuICogQ2hlY2sgaWYgdiBpcyBhIHNlY3VyaXR5IGVycm9yLlxuICpcbiAqIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NRXhjZXB0aW9uLlxuICogQHBhcmFtIHthbnl9IHZcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHYgaXMgYSBzZWN1cml0eSBlcnJvci5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTZWN1cml0eUVycm9yKHYpIHtcbiAgcmV0dXJuIHYgaW5zdGFuY2VvZiBET01FeGNlcHRpb24gJiYgKHYubmFtZSA9PT0gXCJTZWN1cml0eUVycm9yXCIgfHwgdi5jb2RlID09PSB2LlNFQ1VSSVRZX0VSUik7XG59XG4vKipcbiAqIENoZWNrIGlmIHYgaXMgYSBNSU1FIHR5cGUgc3RyaW5nLlxuICpcbiAqIFNlZSBhY2NlcHRlZCBmb3JtYXQ6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9pbnB1dC9maWxlI3VuaXF1ZV9maWxlX3R5cGVfc3BlY2lmaWVycy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc01JTUVUeXBlKHYpIHtcbiAgcmV0dXJuIHYgPT09IFwiYXVkaW8vKlwiIHx8IHYgPT09IFwidmlkZW8vKlwiIHx8IHYgPT09IFwiaW1hZ2UvKlwiIHx8IHYgPT09IFwidGV4dC8qXCIgfHwgdiA9PT0gXCJhcHBsaWNhdGlvbi8qXCIgfHwgL1xcdytcXC9bLSsuXFx3XSsvZy50ZXN0KHYpO1xufVxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGEgZmlsZSBleHRlbnNpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gdlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0V4dCh2KSB7XG4gIHJldHVybiAvXi4qXFwuW1xcd10rJC8udGVzdCh2KTtcbn1cbi8qKlxuICogQHR5cGVkZWYge09iamVjdC48c3RyaW5nLCBzdHJpbmdbXT59IEFjY2VwdFByb3BcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEZpbGVFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1lc3NhZ2VcbiAqIEBwcm9wZXJ0eSB7RXJyb3JDb2RlfHN0cmluZ30gY29kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1wiZmlsZS1pbnZhbGlkLXR5cGVcInxcImZpbGUtdG9vLWxhcmdlXCJ8XCJmaWxlLXRvby1zbWFsbFwifFwidG9vLW1hbnktZmlsZXNcIn0gRXJyb3JDb2RlXG4gKi8iLCJ2YXIgX2V4Y2x1ZGVkID0gW1wiY2hpbGRyZW5cIl0sXG4gICAgX2V4Y2x1ZGVkMiA9IFtcIm9wZW5cIl0sXG4gICAgX2V4Y2x1ZGVkMyA9IFtcInJlZktleVwiLCBcInJvbGVcIiwgXCJvbktleURvd25cIiwgXCJvbkZvY3VzXCIsIFwib25CbHVyXCIsIFwib25DbGlja1wiLCBcIm9uRHJhZ0VudGVyXCIsIFwib25EcmFnT3ZlclwiLCBcIm9uRHJhZ0xlYXZlXCIsIFwib25Ecm9wXCJdLFxuICAgIF9leGNsdWRlZDQgPSBbXCJyZWZLZXlcIiwgXCJvbkNoYW5nZVwiLCBcIm9uQ2xpY2tcIl07XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGVudW1lcmFibGVPbmx5ICYmIChzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSkpLCBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7IH0gcmV0dXJuIGtleXM7IH1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307IGkgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgITApLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTsgdmFyIGtleSwgaTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHNvdXJjZVN5bWJvbEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VTeW1ib2xLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZVN5bWJvbEtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSB7fTsgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpOyB2YXIga2V5LCBpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuLyogZXNsaW50IHByZWZlci10ZW1wbGF0ZTogMCAqL1xuaW1wb3J0IFJlYWN0LCB7IGZvcndhcmRSZWYsIEZyYWdtZW50LCB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VJbXBlcmF0aXZlSGFuZGxlLCB1c2VNZW1vLCB1c2VSZWR1Y2VyLCB1c2VSZWYgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCB7IGZyb21FdmVudCB9IGZyb20gXCJmaWxlLXNlbGVjdG9yXCI7XG5pbXBvcnQgeyBhY2NlcHRQcm9wQXNBY2NlcHRBdHRyLCBhbGxGaWxlc0FjY2VwdGVkLCBjb21wb3NlRXZlbnRIYW5kbGVycywgZmlsZUFjY2VwdGVkLCBmaWxlTWF0Y2hTaXplLCBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJLCBpc0Fib3J0LCBpc0V2dFdpdGhGaWxlcywgaXNJZU9yRWRnZSwgaXNQcm9wYWdhdGlvblN0b3BwZWQsIGlzU2VjdXJpdHlFcnJvciwgb25Eb2N1bWVudERyYWdPdmVyLCBwaWNrZXJPcHRpb25zRnJvbUFjY2VwdCwgVE9PX01BTllfRklMRVNfUkVKRUNUSU9OIH0gZnJvbSBcIi4vdXRpbHMvaW5kZXguanNcIjtcbi8qKlxuICogQ29udmVuaWVuY2Ugd3JhcHBlciBjb21wb25lbnQgZm9yIHRoZSBgdXNlRHJvcHpvbmVgIGhvb2tcbiAqXG4gKiBgYGBqc3hcbiAqIDxEcm9wem9uZT5cbiAqICAgeyh7Z2V0Um9vdFByb3BzLCBnZXRJbnB1dFByb3BzfSkgPT4gKFxuICogICAgIDxkaXYgey4uLmdldFJvb3RQcm9wcygpfT5cbiAqICAgICAgIDxpbnB1dCB7Li4uZ2V0SW5wdXRQcm9wcygpfSAvPlxuICogICAgICAgPHA+RHJhZyAnbicgZHJvcCBzb21lIGZpbGVzIGhlcmUsIG9yIGNsaWNrIHRvIHNlbGVjdCBmaWxlczwvcD5cbiAqICAgICA8L2Rpdj5cbiAqICAgKX1cbiAqIDwvRHJvcHpvbmU+XG4gKiBgYGBcbiAqL1xuXG52YXIgRHJvcHpvbmUgPSAvKiNfX1BVUkVfXyovZm9yd2FyZFJlZihmdW5jdGlvbiAoX3JlZiwgcmVmKSB7XG4gIHZhciBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW4sXG4gICAgICBwYXJhbXMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgX2V4Y2x1ZGVkKTtcblxuICB2YXIgX3VzZURyb3B6b25lID0gdXNlRHJvcHpvbmUocGFyYW1zKSxcbiAgICAgIG9wZW4gPSBfdXNlRHJvcHpvbmUub3BlbixcbiAgICAgIHByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF91c2VEcm9wem9uZSwgX2V4Y2x1ZGVkMik7XG5cbiAgdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3Blbjogb3BlblxuICAgIH07XG4gIH0sIFtvcGVuXSk7IC8vIFRPRE86IEZpZ3VyZSBvdXQgd2h5IHJlYWN0LXN0eWxlZ3VpZGlzdCBjYW5ub3QgY3JlYXRlIGRvY3MgaWYgd2UgZG9uJ3QgcmV0dXJuIGEganN4IGVsZW1lbnRcblxuICByZXR1cm4gLyojX19QVVJFX18qL1JlYWN0LmNyZWF0ZUVsZW1lbnQoRnJhZ21lbnQsIG51bGwsIGNoaWxkcmVuKF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgcHJvcHMpLCB7fSwge1xuICAgIG9wZW46IG9wZW5cbiAgfSkpKTtcbn0pO1xuRHJvcHpvbmUuZGlzcGxheU5hbWUgPSBcIkRyb3B6b25lXCI7IC8vIEFkZCBkZWZhdWx0IHByb3BzIGZvciByZWFjdC1kb2NnZW5cblxudmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBnZXRGaWxlc0Zyb21FdmVudDogZnJvbUV2ZW50LFxuICBtYXhTaXplOiBJbmZpbml0eSxcbiAgbWluU2l6ZTogMCxcbiAgbXVsdGlwbGU6IHRydWUsXG4gIG1heEZpbGVzOiAwLFxuICBwcmV2ZW50RHJvcE9uRG9jdW1lbnQ6IHRydWUsXG4gIG5vQ2xpY2s6IGZhbHNlLFxuICBub0tleWJvYXJkOiBmYWxzZSxcbiAgbm9EcmFnOiBmYWxzZSxcbiAgbm9EcmFnRXZlbnRzQnViYmxpbmc6IGZhbHNlLFxuICB2YWxpZGF0b3I6IG51bGwsXG4gIHVzZUZzQWNjZXNzQXBpOiBmYWxzZSxcbiAgYXV0b0ZvY3VzOiBmYWxzZVxufTtcbkRyb3B6b25lLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbkRyb3B6b25lLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIFJlbmRlciBmdW5jdGlvbiB0aGF0IGV4cG9zZXMgdGhlIGRyb3B6b25lIHN0YXRlIGFuZCBwcm9wIGdldHRlciBmbnNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJhbXMuZ2V0Um9vdFByb3BzIFJldHVybnMgdGhlIHByb3BzIHlvdSBzaG91bGQgYXBwbHkgdG8gdGhlIHJvb3QgZHJvcCBjb250YWluZXIgeW91IHJlbmRlclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJhbXMuZ2V0SW5wdXRQcm9wcyBSZXR1cm5zIHRoZSBwcm9wcyB5b3Ugc2hvdWxkIGFwcGx5IHRvIGhpZGRlbiBmaWxlIGlucHV0IHlvdSByZW5kZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyYW1zLm9wZW4gT3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZ1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0ZvY3VzZWQgRHJvcHpvbmUgYXJlYSBpcyBpbiBmb2N1c1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0ZpbGVEaWFsb2dBY3RpdmUgRmlsZSBkaWFsb2cgaXMgb3BlbmVkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRHJhZ0FjdGl2ZSBBY3RpdmUgZHJhZyBpcyBpbiBwcm9ncmVzc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0RyYWdBY2NlcHQgRHJhZ2dlZCBmaWxlcyBhcmUgYWNjZXB0ZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNEcmFnUmVqZWN0IFRydWUgb25seSBkdXJpbmcgYW4gYWN0aXZlIGRyYWcgd2hlbiBzb21lIGRyYWdnZWQgZmlsZXMgd291bGQgYmUgcmVqZWN0ZWQuIEFmdGVyIGRyb3AsIHRoaXMgcmVzZXRzIHRvIGZhbHNlLiBVc2UgZmlsZVJlamVjdGlvbnMgZm9yIHBvc3QtZHJvcCBlcnJvcnMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRHJhZ0dsb2JhbCBGaWxlcyBhcmUgYmVpbmcgZHJhZ2dlZCBhbnl3aGVyZSBvbiB0aGUgZG9jdW1lbnRcbiAgICogQHBhcmFtIHtGaWxlW119IHBhcmFtcy5hY2NlcHRlZEZpbGVzIEFjY2VwdGVkIGZpbGVzXG4gICAqIEBwYXJhbSB7RmlsZVJlamVjdGlvbltdfSBwYXJhbXMuZmlsZVJlamVjdGlvbnMgUmVqZWN0ZWQgZmlsZXMgYW5kIHdoeSB0aGV5IHdlcmUgcmVqZWN0ZWQuIFRoaXMgcGVyc2lzdHMgYWZ0ZXIgZHJvcCBhbmQgaXMgdGhlIHNvdXJjZSBvZiB0cnV0aCBmb3IgcG9zdC1kcm9wIHJlamVjdGlvbnMuXG4gICAqL1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIFNldCBhY2NlcHRlZCBmaWxlIHR5cGVzLlxuICAgKiBDaGVja291dCBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3Nob3dPcGVuRmlsZVBpY2tlciB0eXBlcyBvcHRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAqIEtlZXAgaW4gbWluZCB0aGF0IG1pbWUgdHlwZSBkZXRlcm1pbmF0aW9uIGlzIG5vdCByZWxpYWJsZSBhY3Jvc3MgcGxhdGZvcm1zLiBDU1YgZmlsZXMsXG4gICAqIGZvciBleGFtcGxlLCBhcmUgcmVwb3J0ZWQgYXMgdGV4dC9wbGFpbiB1bmRlciBtYWNPUyBidXQgYXMgYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsIHVuZGVyXG4gICAqIFdpbmRvd3MuIEluIHNvbWUgY2FzZXMgdGhlcmUgbWlnaHQgbm90IGJlIGEgbWltZSB0eXBlIHNldCBhdCBhbGwgKGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdC1kcm9wem9uZS9yZWFjdC1kcm9wem9uZS9pc3N1ZXMvMjc2KS5cbiAgICovXG4gIGFjY2VwdDogUHJvcFR5cGVzLm9iamVjdE9mKFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpKSxcblxuICAvKipcbiAgICogQWxsb3cgZHJhZyAnbicgZHJvcCAob3Igc2VsZWN0aW9uIGZyb20gdGhlIGZpbGUgZGlhbG9nKSBvZiBtdWx0aXBsZSBmaWxlc1xuICAgKi9cbiAgbXVsdGlwbGU6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiBmYWxzZSwgYWxsb3cgZHJvcHBlZCBpdGVtcyB0byB0YWtlIG92ZXIgdGhlIGN1cnJlbnQgYnJvd3NlciB3aW5kb3dcbiAgICovXG4gIHByZXZlbnREcm9wT25Eb2N1bWVudDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGRpc2FibGVzIGNsaWNrIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2dcbiAgICovXG4gIG5vQ2xpY2s6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBkaXNhYmxlcyBTUEFDRS9FTlRFUiB0byBvcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nLlxuICAgKiBOb3RlIHRoYXQgaXQgYWxzbyBzdG9wcyB0cmFja2luZyB0aGUgZm9jdXMgc3RhdGUuXG4gICAqL1xuICBub0tleWJvYXJkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgZGlzYWJsZXMgZHJhZyAnbicgZHJvcFxuICAgKi9cbiAgbm9EcmFnOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgc3RvcHMgZHJhZyBldmVudCBwcm9wYWdhdGlvbiB0byBwYXJlbnRzXG4gICAqL1xuICBub0RyYWdFdmVudHNCdWJibGluZzogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIE1pbmltdW0gZmlsZSBzaXplIChpbiBieXRlcylcbiAgICovXG4gIG1pblNpemU6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAqIE1heGltdW0gZmlsZSBzaXplIChpbiBieXRlcylcbiAgICovXG4gIG1heFNpemU6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgLyoqXG4gICAqIE1heGltdW0gYWNjZXB0ZWQgbnVtYmVyIG9mIGZpbGVzXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDAgd2hpY2ggbWVhbnMgdGhlcmUgaXMgbm8gbGltaXRhdGlvbiB0byBob3cgbWFueSBmaWxlcyBhcmUgYWNjZXB0ZWQuXG4gICAqL1xuICBtYXhGaWxlczogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICogRW5hYmxlL2Rpc2FibGUgdGhlIGRyb3B6b25lXG4gICAqL1xuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIHRvIHByb3ZpZGUgYSBjdXN0b20gZmlsZSBhZ2dyZWdhdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudHxBcnJheTxGaWxlU3lzdGVtRmlsZUhhbmRsZT4pfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gICAqL1xuICBnZXRGaWxlc0Zyb21FdmVudDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIGNsb3NpbmcgdGhlIGZpbGUgZGlhbG9nIHdpdGggbm8gc2VsZWN0aW9uXG4gICAqL1xuICBvbkZpbGVEaWFsb2dDYW5jZWw6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiBvcGVuaW5nIHRoZSBmaWxlIGRpYWxvZ1xuICAgKi9cbiAgb25GaWxlRGlhbG9nT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIHRvIHVzZSB0aGUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVfU3lzdGVtX0FjY2Vzc19BUElcbiAgICogdG8gb3BlbiB0aGUgZmlsZSBwaWNrZXIgaW5zdGVhZCBvZiB1c2luZyBhbiBgPGlucHV0IHR5cGU9XCJmaWxlXCI+YCBjbGljayBldmVudC5cbiAgICovXG4gIHVzZUZzQWNjZXNzQXBpOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogU2V0IHRvIHRydWUgdG8gZm9jdXMgdGhlIHJvb3QgZWxlbWVudCBvbiByZW5kZXJcbiAgICovXG4gIGF1dG9Gb2N1czogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJhZ2VudGVyYCBldmVudCBvY2N1cnMuXG4gICAqXG4gICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudFxuICAgKi9cbiAgb25EcmFnRW50ZXI6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyYWdsZWF2ZWAgZXZlbnQgb2NjdXJzXG4gICAqXG4gICAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudFxuICAgKi9cbiAgb25EcmFnTGVhdmU6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyYWdvdmVyYCBldmVudCBvY2N1cnNcbiAgICpcbiAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50XG4gICAqL1xuICBvbkRyYWdPdmVyOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcm9wYCBldmVudCBvY2N1cnMuXG4gICAqIE5vdGUgdGhhdCB0aGlzIGNhbGxiYWNrIGlzIGludm9rZWQgYWZ0ZXIgdGhlIGBnZXRGaWxlc0Zyb21FdmVudGAgY2FsbGJhY2sgaXMgZG9uZS5cbiAgICpcbiAgICogRmlsZXMgYXJlIGFjY2VwdGVkIG9yIHJlamVjdGVkIGJhc2VkIG9uIHRoZSBgYWNjZXB0YCwgYG11bHRpcGxlYCwgYG1pblNpemVgIGFuZCBgbWF4U2l6ZWAgcHJvcHMuXG4gICAqIGBhY2NlcHRgIG11c3QgYmUgYSB2YWxpZCBbTUlNRSB0eXBlXShodHRwOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL21lZGlhLXR5cGVzL21lZGlhLXR5cGVzLnhodG1sKSBhY2NvcmRpbmcgdG8gW2lucHV0IGVsZW1lbnQgc3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly93d3cudzMub3JnL3dpa2kvSFRNTC9FbGVtZW50cy9pbnB1dC9maWxlKSBvciBhIHZhbGlkIGZpbGUgZXh0ZW5zaW9uLlxuICAgKiBJZiBgbXVsdGlwbGVgIGlzIHNldCB0byBmYWxzZSBhbmQgYWRkaXRpb25hbCBmaWxlcyBhcmUgZHJvcHBlZCxcbiAgICogYWxsIGZpbGVzIGJlc2lkZXMgdGhlIGZpcnN0IHdpbGwgYmUgcmVqZWN0ZWQuXG4gICAqIEFueSBmaWxlIHdoaWNoIGRvZXMgbm90IGhhdmUgYSBzaXplIGluIHRoZSBbYG1pblNpemVgLCBgbWF4U2l6ZWBdIHJhbmdlLCB3aWxsIGJlIHJlamVjdGVkIGFzIHdlbGwuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgYG9uRHJvcGAgY2FsbGJhY2sgd2lsbCBhbHdheXMgYmUgaW52b2tlZCByZWdhcmRsZXNzIGlmIHRoZSBkcm9wcGVkIGZpbGVzIHdlcmUgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQuXG4gICAqIElmIHlvdSdkIGxpa2UgdG8gcmVhY3QgdG8gYSBzcGVjaWZpYyBzY2VuYXJpbywgdXNlIHRoZSBgb25Ecm9wQWNjZXB0ZWRgL2BvbkRyb3BSZWplY3RlZGAgcHJvcHMuXG4gICAqXG4gICAqIGBvbkRyb3BgIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhbiBhcnJheSBvZiBbRmlsZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGUpIG9iamVjdHMgd2hpY2ggeW91IGNhbiB0aGVuIHByb2Nlc3MgYW5kIHNlbmQgdG8gYSBzZXJ2ZXIuXG4gICAqIEZvciBleGFtcGxlLCB3aXRoIFtTdXBlckFnZW50XShodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvc3VwZXJhZ2VudCkgYXMgYSBodHRwL2FqYXggbGlicmFyeTpcbiAgICpcbiAgICogYGBganNcbiAgICogZnVuY3Rpb24gb25Ecm9wKGFjY2VwdGVkRmlsZXMpIHtcbiAgICogICBjb25zdCByZXEgPSByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICAgKiAgIGFjY2VwdGVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICogICAgIHJlcS5hdHRhY2goZmlsZS5uYW1lLCBmaWxlKVxuICAgKiAgIH0pXG4gICAqICAgcmVxLmVuZChjYWxsYmFjaylcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtGaWxlW119IGFjY2VwdGVkRmlsZXNcbiAgICogQHBhcmFtIHtGaWxlUmVqZWN0aW9uW119IGZpbGVSZWplY3Rpb25zXG4gICAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAgICovXG4gIG9uRHJvcDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJvcGAgZXZlbnQgb2NjdXJzLlxuICAgKiBOb3RlIHRoYXQgaWYgbm8gZmlsZXMgYXJlIGFjY2VwdGVkLCB0aGlzIGNhbGxiYWNrIGlzIG5vdCBpbnZva2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXNcbiAgICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnRcbiAgICovXG4gIG9uRHJvcEFjY2VwdGVkOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcm9wYCBldmVudCBvY2N1cnMuXG4gICAqIE5vdGUgdGhhdCBpZiBubyBmaWxlcyBhcmUgcmVqZWN0ZWQsIHRoaXMgY2FsbGJhY2sgaXMgbm90IGludm9rZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZVJlamVjdGlvbltdfSBmaWxlUmVqZWN0aW9uc1xuICAgKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudFxuICAgKi9cbiAgb25Ecm9wUmVqZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGVyZSdzIHNvbWUgZXJyb3IgZnJvbSBhbnkgb2YgdGhlIHByb21pc2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICAgKi9cbiAgb25FcnJvcjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIEN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9uLiBJdCBtdXN0IHJldHVybiBudWxsIGlmIHRoZXJlJ3Mgbm8gZXJyb3JzLlxuICAgKiBAcGFyYW0ge0ZpbGV9IGZpbGVcbiAgICogQHJldHVybnMge0ZpbGVFcnJvcnxGaWxlRXJyb3JbXXxudWxsfVxuICAgKi9cbiAgdmFsaWRhdG9yOiBQcm9wVHlwZXMuZnVuY1xufTtcbmV4cG9ydCBkZWZhdWx0IERyb3B6b25lO1xuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3IgdGhlIGBkcmFnZW50ZXJgLFxuICogYGRyYWdvdmVyYCBhbmQgYGRyYWdsZWF2ZWAgZXZlbnRzLlxuICogSXQgaXMgbm90IGludm9rZWQgaWYgdGhlIGl0ZW1zIGFyZSBub3QgZmlsZXMgKHN1Y2ggYXMgbGluaywgdGV4dCwgZXRjLikuXG4gKlxuICogQGNhbGxiYWNrIGRyYWdDYlxuICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50XG4gKi9cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3IgdGhlIGBkcm9wYCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQuXG4gKiBJdCBpcyBub3QgaW52b2tlZCBpZiB0aGUgaXRlbXMgYXJlIG5vdCBmaWxlcyAoc3VjaCBhcyBsaW5rLCB0ZXh0LCBldGMuKS5cbiAqXG4gKiBAY2FsbGJhY2sgZHJvcENiXG4gKiBAcGFyYW0ge0ZpbGVbXX0gYWNjZXB0ZWRGaWxlcyBMaXN0IG9mIGFjY2VwdGVkIGZpbGVzXG4gKiBAcGFyYW0ge0ZpbGVSZWplY3Rpb25bXX0gZmlsZVJlamVjdGlvbnMgTGlzdCBvZiByZWplY3RlZCBmaWxlcyBhbmQgd2h5IHRoZXkgd2VyZSByZWplY3RlZC4gVGhpcyBpcyB0aGUgYXV0aG9yaXRhdGl2ZSBzb3VyY2UgZm9yIHBvc3QtZHJvcCBmaWxlIHJlamVjdGlvbnMuXG4gKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gKi9cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBmb3IgdGhlIGBkcm9wYCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQuXG4gKiBJdCBpcyBub3QgaW52b2tlZCBpZiB0aGUgaXRlbXMgYXJlIGZpbGVzIChzdWNoIGFzIGxpbmssIHRleHQsIGV0Yy4pLlxuICpcbiAqIEBjYWxsYmFjayBkcm9wQWNjZXB0ZWRDYlxuICogQHBhcmFtIHtGaWxlW119IGZpbGVzIExpc3Qgb2YgYWNjZXB0ZWQgZmlsZXMgdGhhdCBtZWV0IHRoZSBnaXZlbiBjcml0ZXJpYVxuICogKGBhY2NlcHRgLCBgbXVsdGlwbGVgLCBgbWluU2l6ZWAsIGBtYXhTaXplYClcbiAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGZvciB0aGUgYGRyb3BgIG9yIGlucHV0IGNoYW5nZSBldmVudC5cbiAqXG4gKiBAY2FsbGJhY2sgZHJvcFJlamVjdGVkQ2JcbiAqIEBwYXJhbSB7RmlsZVtdfSBmaWxlcyBMaXN0IG9mIHJlamVjdGVkIGZpbGVzIHRoYXQgZG8gbm90IG1lZXQgdGhlIGdpdmVuIGNyaXRlcmlhXG4gKiAoYGFjY2VwdGAsIGBtdWx0aXBsZWAsIGBtaW5TaXplYCwgYG1heFNpemVgKVxuICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgYWdncmVnYXRlIGZpbGVzLFxuICogaW4gYSBhc3luY2hyb25vdXMgZmFzaGlvbiwgZnJvbSBkcmFnIG9yIGlucHV0IGNoYW5nZSBldmVudHMuXG4gKlxuICogQGNhbGxiYWNrIGdldEZpbGVzRnJvbUV2ZW50XG4gKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnR8QXJyYXk8RmlsZVN5c3RlbUZpbGVIYW5kbGU+KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICogQHJldHVybnMgeyhGaWxlW118UHJvbWlzZTxGaWxlW10+KX1cbiAqL1xuXG4vKipcbiAqIEFuIG9iamVjdCB3aXRoIHRoZSBjdXJyZW50IGRyb3B6b25lIHN0YXRlLlxuICpcbiAqIEB0eXBlZGVmIHtvYmplY3R9IERyb3B6b25lU3RhdGVcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNGb2N1c2VkIERyb3B6b25lIGFyZWEgaXMgaW4gZm9jdXNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNGaWxlRGlhbG9nQWN0aXZlIEZpbGUgZGlhbG9nIGlzIG9wZW5lZFxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0RyYWdBY3RpdmUgQWN0aXZlIGRyYWcgaXMgaW4gcHJvZ3Jlc3NcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNEcmFnQWNjZXB0IERyYWdnZWQgZmlsZXMgYXJlIGFjY2VwdGVkXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRHJhZ1JlamVjdCBUcnVlIG9ubHkgZHVyaW5nIGFuIGFjdGl2ZSBkcmFnIHdoZW4gc29tZSBkcmFnZ2VkIGZpbGVzIHdvdWxkIGJlIHJlamVjdGVkLiBBZnRlciBkcm9wLCB0aGlzIHJlc2V0cyB0byBmYWxzZS4gVXNlIGZpbGVSZWplY3Rpb25zIGZvciBwb3N0LWRyb3AgZXJyb3JzLlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0RyYWdHbG9iYWwgRmlsZXMgYXJlIGJlaW5nIGRyYWdnZWQgYW55d2hlcmUgb24gdGhlIGRvY3VtZW50XG4gKiBAcHJvcGVydHkge0ZpbGVbXX0gYWNjZXB0ZWRGaWxlcyBBY2NlcHRlZCBmaWxlc1xuICogQHByb3BlcnR5IHtGaWxlUmVqZWN0aW9uW119IGZpbGVSZWplY3Rpb25zIFJlamVjdGVkIGZpbGVzIGFuZCB3aHkgdGhleSB3ZXJlIHJlamVjdGVkLiBUaGlzIHBlcnNpc3RzIGFmdGVyIGRyb3AgYW5kIGlzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHBvc3QtZHJvcCByZWplY3Rpb25zLlxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHdpdGggdGhlIGRyb3B6b25lIG1ldGhvZHMuXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gRHJvcHpvbmVNZXRob2RzXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRSb290UHJvcHMgUmV0dXJucyB0aGUgcHJvcHMgeW91IHNob3VsZCBhcHBseSB0byB0aGUgcm9vdCBkcm9wIGNvbnRhaW5lciB5b3UgcmVuZGVyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRJbnB1dFByb3BzIFJldHVybnMgdGhlIHByb3BzIHlvdSBzaG91bGQgYXBwbHkgdG8gaGlkZGVuIGZpbGUgaW5wdXQgeW91IHJlbmRlclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3BlbiBPcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nXG4gKi9cblxudmFyIGluaXRpYWxTdGF0ZSA9IHtcbiAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgaXNGaWxlRGlhbG9nQWN0aXZlOiBmYWxzZSxcbiAgaXNEcmFnQWN0aXZlOiBmYWxzZSxcbiAgaXNEcmFnQWNjZXB0OiBmYWxzZSxcbiAgaXNEcmFnUmVqZWN0OiBmYWxzZSxcbiAgaXNEcmFnR2xvYmFsOiBmYWxzZSxcbiAgYWNjZXB0ZWRGaWxlczogW10sXG4gIGZpbGVSZWplY3Rpb25zOiBbXVxufTtcbi8qKlxuICogQSBSZWFjdCBob29rIHRoYXQgY3JlYXRlcyBhIGRyYWcgJ24nIGRyb3AgYXJlYS5cbiAqXG4gKiBgYGBqc3hcbiAqIGZ1bmN0aW9uIE15RHJvcHpvbmUocHJvcHMpIHtcbiAqICAgY29uc3Qge2dldFJvb3RQcm9wcywgZ2V0SW5wdXRQcm9wc30gPSB1c2VEcm9wem9uZSh7XG4gKiAgICAgb25Ecm9wOiBhY2NlcHRlZEZpbGVzID0+IHtcbiAqICAgICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBGaWxlIG9iamVjdHMsIGUuZy4gdXBsb2FkIHRvIHNvbWUgc2VydmVyXG4gKiAgICAgfVxuICogICB9KTtcbiAqICAgcmV0dXJuIChcbiAqICAgICA8ZGl2IHsuLi5nZXRSb290UHJvcHMoKX0+XG4gKiAgICAgICA8aW5wdXQgey4uLmdldElucHV0UHJvcHMoKX0gLz5cbiAqICAgICAgIDxwPkRyYWcgYW5kIGRyb3Agc29tZSBmaWxlcyBoZXJlLCBvciBjbGljayB0byBzZWxlY3QgZmlsZXM8L3A+XG4gKiAgICAgPC9kaXY+XG4gKiAgIClcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBmdW5jdGlvbiB1c2VEcm9wem9uZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICogQHBhcmFtIHtpbXBvcnQoXCIuL3V0aWxzXCIpLkFjY2VwdFByb3B9IFtwcm9wcy5hY2NlcHRdIFNldCBhY2NlcHRlZCBmaWxlIHR5cGVzLlxuICogQ2hlY2tvdXQgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9zaG93T3BlbkZpbGVQaWNrZXIgdHlwZXMgb3B0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICogS2VlcCBpbiBtaW5kIHRoYXQgbWltZSB0eXBlIGRldGVybWluYXRpb24gaXMgbm90IHJlbGlhYmxlIGFjcm9zcyBwbGF0Zm9ybXMuIENTViBmaWxlcyxcbiAqIGZvciBleGFtcGxlLCBhcmUgcmVwb3J0ZWQgYXMgdGV4dC9wbGFpbiB1bmRlciBtYWNPUyBidXQgYXMgYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsIHVuZGVyXG4gKiBXaW5kb3dzLiBJbiBzb21lIGNhc2VzIHRoZXJlIG1pZ2h0IG5vdCBiZSBhIG1pbWUgdHlwZSBzZXQgYXQgYWxsIChodHRwczovL2dpdGh1Yi5jb20vcmVhY3QtZHJvcHpvbmUvcmVhY3QtZHJvcHpvbmUvaXNzdWVzLzI3NikuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5tdWx0aXBsZT10cnVlXSBBbGxvdyBkcmFnICduJyBkcm9wIChvciBzZWxlY3Rpb24gZnJvbSB0aGUgZmlsZSBkaWFsb2cpIG9mIG11bHRpcGxlIGZpbGVzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5wcmV2ZW50RHJvcE9uRG9jdW1lbnQ9dHJ1ZV0gSWYgZmFsc2UsIGFsbG93IGRyb3BwZWQgaXRlbXMgdG8gdGFrZSBvdmVyIHRoZSBjdXJyZW50IGJyb3dzZXIgd2luZG93XG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5ub0NsaWNrPWZhbHNlXSBJZiB0cnVlLCBkaXNhYmxlcyBjbGljayB0byBvcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5ub0tleWJvYXJkPWZhbHNlXSBJZiB0cnVlLCBkaXNhYmxlcyBTUEFDRS9FTlRFUiB0byBvcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nLlxuICogTm90ZSB0aGF0IGl0IGFsc28gc3RvcHMgdHJhY2tpbmcgdGhlIGZvY3VzIHN0YXRlLlxuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMubm9EcmFnPWZhbHNlXSBJZiB0cnVlLCBkaXNhYmxlcyBkcmFnICduJyBkcm9wXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5ub0RyYWdFdmVudHNCdWJibGluZz1mYWxzZV0gSWYgdHJ1ZSwgc3RvcHMgZHJhZyBldmVudCBwcm9wYWdhdGlvbiB0byBwYXJlbnRzXG4gKiBAcGFyYW0ge251bWJlcn0gW3Byb3BzLm1pblNpemU9MF0gTWluaW11bSBmaWxlIHNpemUgKGluIGJ5dGVzKVxuICogQHBhcmFtIHtudW1iZXJ9IFtwcm9wcy5tYXhTaXplPUluZmluaXR5XSBNYXhpbXVtIGZpbGUgc2l6ZSAoaW4gYnl0ZXMpXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5kaXNhYmxlZD1mYWxzZV0gRW5hYmxlL2Rpc2FibGUgdGhlIGRyb3B6b25lXG4gKiBAcGFyYW0ge2dldEZpbGVzRnJvbUV2ZW50fSBbcHJvcHMuZ2V0RmlsZXNGcm9tRXZlbnRdIFVzZSB0aGlzIHRvIHByb3ZpZGUgYSBjdXN0b20gZmlsZSBhZ2dyZWdhdG9yXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvcHMub25GaWxlRGlhbG9nQ2FuY2VsXSBDYiBmb3Igd2hlbiBjbG9zaW5nIHRoZSBmaWxlIGRpYWxvZyB3aXRoIG5vIHNlbGVjdGlvblxuICogQHBhcmFtIHtib29sZWFufSBbcHJvcHMudXNlRnNBY2Nlc3NBcGldIFNldCB0byB0cnVlIHRvIHVzZSB0aGUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVfU3lzdGVtX0FjY2Vzc19BUElcbiAqIHRvIG9wZW4gdGhlIGZpbGUgcGlja2VyIGluc3RlYWQgb2YgdXNpbmcgYW4gYDxpbnB1dCB0eXBlPVwiZmlsZVwiPmAgY2xpY2sgZXZlbnQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9Gb2N1cyBTZXQgdG8gdHJ1ZSB0byBhdXRvIGZvY3VzIHRoZSByb290IGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvcHMub25GaWxlRGlhbG9nT3Blbl0gQ2IgZm9yIHdoZW4gb3BlbmluZyB0aGUgZmlsZSBkaWFsb2dcbiAqIEBwYXJhbSB7ZHJhZ0NifSBbcHJvcHMub25EcmFnRW50ZXJdIENiIGZvciB3aGVuIHRoZSBgZHJhZ2VudGVyYCBldmVudCBvY2N1cnMuXG4gKiBAcGFyYW0ge2RyYWdDYn0gW3Byb3BzLm9uRHJhZ0xlYXZlXSBDYiBmb3Igd2hlbiB0aGUgYGRyYWdsZWF2ZWAgZXZlbnQgb2NjdXJzXG4gKiBAcGFyYW0ge2RyYWdDYn0gW3Byb3BzLm9uRHJhZ092ZXJdIENiIGZvciB3aGVuIHRoZSBgZHJhZ292ZXJgIGV2ZW50IG9jY3Vyc1xuICogQHBhcmFtIHtkcm9wQ2J9IFtwcm9wcy5vbkRyb3BdIENiIGZvciB3aGVuIHRoZSBgZHJvcGAgZXZlbnQgb2NjdXJzLlxuICogTm90ZSB0aGF0IHRoaXMgY2FsbGJhY2sgaXMgaW52b2tlZCBhZnRlciB0aGUgYGdldEZpbGVzRnJvbUV2ZW50YCBjYWxsYmFjayBpcyBkb25lLlxuICpcbiAqIEZpbGVzIGFyZSBhY2NlcHRlZCBvciByZWplY3RlZCBiYXNlZCBvbiB0aGUgYGFjY2VwdGAsIGBtdWx0aXBsZWAsIGBtaW5TaXplYCBhbmQgYG1heFNpemVgIHByb3BzLlxuICogYGFjY2VwdGAgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBrZXlzIGFzIGEgdmFsaWQgW01JTUUgdHlwZV0oaHR0cDovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9tZWRpYS10eXBlcy9tZWRpYS10eXBlcy54aHRtbCkgYWNjb3JkaW5nIHRvIFtpbnB1dCBlbGVtZW50IHNwZWNpZmljYXRpb25dKGh0dHBzOi8vd3d3LnczLm9yZy93aWtpL0hUTUwvRWxlbWVudHMvaW5wdXQvZmlsZSkgYW5kIHRoZSB2YWx1ZSBhbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgKG9wdGlvbmFsKS5cbiAqIElmIGBtdWx0aXBsZWAgaXMgc2V0IHRvIGZhbHNlIGFuZCBhZGRpdGlvbmFsIGZpbGVzIGFyZSBkcm9wcGVkLFxuICogYWxsIGZpbGVzIGJlc2lkZXMgdGhlIGZpcnN0IHdpbGwgYmUgcmVqZWN0ZWQuXG4gKiBBbnkgZmlsZSB3aGljaCBkb2VzIG5vdCBoYXZlIGEgc2l6ZSBpbiB0aGUgW2BtaW5TaXplYCwgYG1heFNpemVgXSByYW5nZSwgd2lsbCBiZSByZWplY3RlZCBhcyB3ZWxsLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgYG9uRHJvcGAgY2FsbGJhY2sgd2lsbCBhbHdheXMgYmUgaW52b2tlZCByZWdhcmRsZXNzIGlmIHRoZSBkcm9wcGVkIGZpbGVzIHdlcmUgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQuXG4gKiBJZiB5b3UnZCBsaWtlIHRvIHJlYWN0IHRvIGEgc3BlY2lmaWMgc2NlbmFyaW8sIHVzZSB0aGUgYG9uRHJvcEFjY2VwdGVkYC9gb25Ecm9wUmVqZWN0ZWRgIHByb3BzLlxuICpcbiAqIFRoZSBzZWNvbmQgcGFyYW1ldGVyIChmaWxlUmVqZWN0aW9ucykgaXMgdGhlIGF1dGhvcml0YXRpdmUgbGlzdCBvZiByZWplY3RlZCBmaWxlcyBhZnRlciBhIGRyb3AuXG4gKiBVc2UgdGhpcyBwYXJhbWV0ZXIgb3IgdGhlIGZpbGVSZWplY3Rpb25zIHN0YXRlIHByb3BlcnR5IHRvIGhhbmRsZSBwb3N0LWRyb3AgZmlsZSByZWplY3Rpb25zLFxuICogYXMgaXNEcmFnUmVqZWN0IG9ubHkgaW5kaWNhdGVzIHJlamVjdGlvbiBzdGF0ZSBkdXJpbmcgYWN0aXZlIGRyYWcgb3BlcmF0aW9ucy5cbiAqXG4gKiBgb25Ecm9wYCB3aWxsIHByb3ZpZGUgeW91IHdpdGggYW4gYXJyYXkgb2YgW0ZpbGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlKSBvYmplY3RzIHdoaWNoIHlvdSBjYW4gdGhlbiBwcm9jZXNzIGFuZCBzZW5kIHRvIGEgc2VydmVyLlxuICogRm9yIGV4YW1wbGUsIHdpdGggW1N1cGVyQWdlbnRdKGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9zdXBlcmFnZW50KSBhcyBhIGh0dHAvYWpheCBsaWJyYXJ5OlxuICpcbiAqIGBgYGpzXG4gKiBmdW5jdGlvbiBvbkRyb3AoYWNjZXB0ZWRGaWxlcykge1xuICogICBjb25zdCByZXEgPSByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICBhY2NlcHRlZEZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gKiAgICAgcmVxLmF0dGFjaChmaWxlLm5hbWUsIGZpbGUpXG4gKiAgIH0pXG4gKiAgIHJlcS5lbmQoY2FsbGJhY2spXG4gKiB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7ZHJvcEFjY2VwdGVkQ2J9IFtwcm9wcy5vbkRyb3BBY2NlcHRlZF1cbiAqIEBwYXJhbSB7ZHJvcFJlamVjdGVkQ2J9IFtwcm9wcy5vbkRyb3BSZWplY3RlZF1cbiAqIEBwYXJhbSB7KGVycm9yOiBFcnJvcikgPT4gdm9pZH0gW3Byb3BzLm9uRXJyb3JdXG4gKlxuICogQHJldHVybnMge0Ryb3B6b25lU3RhdGUgJiBEcm9wem9uZU1ldGhvZHN9XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURyb3B6b25lKCkge1xuICB2YXIgcHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBfZGVmYXVsdFByb3BzJHByb3BzID0gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBkZWZhdWx0UHJvcHMpLCBwcm9wcyksXG4gICAgICBhY2NlcHQgPSBfZGVmYXVsdFByb3BzJHByb3BzLmFjY2VwdCxcbiAgICAgIGRpc2FibGVkID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5kaXNhYmxlZCxcbiAgICAgIGdldEZpbGVzRnJvbUV2ZW50ID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5nZXRGaWxlc0Zyb21FdmVudCxcbiAgICAgIG1heFNpemUgPSBfZGVmYXVsdFByb3BzJHByb3BzLm1heFNpemUsXG4gICAgICBtaW5TaXplID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5taW5TaXplLFxuICAgICAgbXVsdGlwbGUgPSBfZGVmYXVsdFByb3BzJHByb3BzLm11bHRpcGxlLFxuICAgICAgbWF4RmlsZXMgPSBfZGVmYXVsdFByb3BzJHByb3BzLm1heEZpbGVzLFxuICAgICAgb25EcmFnRW50ZXIgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRHJhZ0VudGVyLFxuICAgICAgb25EcmFnTGVhdmUgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRHJhZ0xlYXZlLFxuICAgICAgb25EcmFnT3ZlciA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25EcmFnT3ZlcixcbiAgICAgIG9uRHJvcCA9IF9kZWZhdWx0UHJvcHMkcHJvcHMub25Ecm9wLFxuICAgICAgb25Ecm9wQWNjZXB0ZWQgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRHJvcEFjY2VwdGVkLFxuICAgICAgb25Ecm9wUmVqZWN0ZWQgPSBfZGVmYXVsdFByb3BzJHByb3BzLm9uRHJvcFJlamVjdGVkLFxuICAgICAgb25GaWxlRGlhbG9nQ2FuY2VsID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkZpbGVEaWFsb2dDYW5jZWwsXG4gICAgICBvbkZpbGVEaWFsb2dPcGVuID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkZpbGVEaWFsb2dPcGVuLFxuICAgICAgdXNlRnNBY2Nlc3NBcGkgPSBfZGVmYXVsdFByb3BzJHByb3BzLnVzZUZzQWNjZXNzQXBpLFxuICAgICAgYXV0b0ZvY3VzID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5hdXRvRm9jdXMsXG4gICAgICBwcmV2ZW50RHJvcE9uRG9jdW1lbnQgPSBfZGVmYXVsdFByb3BzJHByb3BzLnByZXZlbnREcm9wT25Eb2N1bWVudCxcbiAgICAgIG5vQ2xpY2sgPSBfZGVmYXVsdFByb3BzJHByb3BzLm5vQ2xpY2ssXG4gICAgICBub0tleWJvYXJkID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5ub0tleWJvYXJkLFxuICAgICAgbm9EcmFnID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5ub0RyYWcsXG4gICAgICBub0RyYWdFdmVudHNCdWJibGluZyA9IF9kZWZhdWx0UHJvcHMkcHJvcHMubm9EcmFnRXZlbnRzQnViYmxpbmcsXG4gICAgICBvbkVycm9yID0gX2RlZmF1bHRQcm9wcyRwcm9wcy5vbkVycm9yLFxuICAgICAgdmFsaWRhdG9yID0gX2RlZmF1bHRQcm9wcyRwcm9wcy52YWxpZGF0b3I7XG5cbiAgdmFyIGFjY2VwdEF0dHIgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYWNjZXB0UHJvcEFzQWNjZXB0QXR0cihhY2NlcHQpO1xuICB9LCBbYWNjZXB0XSk7XG4gIHZhciBwaWNrZXJUeXBlcyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwaWNrZXJPcHRpb25zRnJvbUFjY2VwdChhY2NlcHQpO1xuICB9LCBbYWNjZXB0XSk7XG4gIHZhciBvbkZpbGVEaWFsb2dPcGVuQ2IgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9uRmlsZURpYWxvZ09wZW4gPT09IFwiZnVuY3Rpb25cIiA/IG9uRmlsZURpYWxvZ09wZW4gOiBub29wO1xuICB9LCBbb25GaWxlRGlhbG9nT3Blbl0pO1xuICB2YXIgb25GaWxlRGlhbG9nQ2FuY2VsQ2IgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9uRmlsZURpYWxvZ0NhbmNlbCA9PT0gXCJmdW5jdGlvblwiID8gb25GaWxlRGlhbG9nQ2FuY2VsIDogbm9vcDtcbiAgfSwgW29uRmlsZURpYWxvZ0NhbmNlbF0pO1xuICAvKipcbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtSZWFjdC5NdXRhYmxlUmVmT2JqZWN0PEhUTUxFbGVtZW50Pn1cbiAgICovXG5cbiAgdmFyIHJvb3RSZWYgPSB1c2VSZWYobnVsbCk7XG4gIHZhciBpbnB1dFJlZiA9IHVzZVJlZihudWxsKTtcblxuICB2YXIgX3VzZVJlZHVjZXIgPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSksXG4gICAgICBfdXNlUmVkdWNlcjIgPSBfc2xpY2VkVG9BcnJheShfdXNlUmVkdWNlciwgMiksXG4gICAgICBzdGF0ZSA9IF91c2VSZWR1Y2VyMlswXSxcbiAgICAgIGRpc3BhdGNoID0gX3VzZVJlZHVjZXIyWzFdO1xuXG4gIHZhciBpc0ZvY3VzZWQgPSBzdGF0ZS5pc0ZvY3VzZWQsXG4gICAgICBpc0ZpbGVEaWFsb2dBY3RpdmUgPSBzdGF0ZS5pc0ZpbGVEaWFsb2dBY3RpdmU7XG4gIHZhciBmc0FjY2Vzc0FwaVdvcmtzUmVmID0gdXNlUmVmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmlzU2VjdXJlQ29udGV4dCAmJiB1c2VGc0FjY2Vzc0FwaSAmJiBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJKCkpOyAvLyBVcGRhdGUgZmlsZSBkaWFsb2cgYWN0aXZlIHN0YXRlIHdoZW4gdGhlIHdpbmRvdyBpcyBmb2N1c2VkIG9uXG5cbiAgdmFyIG9uV2luZG93Rm9jdXMgPSBmdW5jdGlvbiBvbldpbmRvd0ZvY3VzKCkge1xuICAgIC8vIEV4ZWN1dGUgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZmlsZSBkaWFsb2cgaXMgb3BlbmVkIGluIHRoZSBicm93c2VyXG4gICAgaWYgKCFmc0FjY2Vzc0FwaVdvcmtzUmVmLmN1cnJlbnQgJiYgaXNGaWxlRGlhbG9nQWN0aXZlKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgZmlsZXMgPSBpbnB1dFJlZi5jdXJyZW50LmZpbGVzO1xuXG4gICAgICAgICAgaWYgKCFmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgdHlwZTogXCJjbG9zZURpYWxvZ1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG9uRmlsZURpYWxvZ0NhbmNlbENiKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCAzMDApO1xuICAgIH1cbiAgfTtcblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgb25XaW5kb3dGb2N1cywgZmFsc2UpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIG9uV2luZG93Rm9jdXMsIGZhbHNlKTtcbiAgICB9O1xuICB9LCBbaW5wdXRSZWYsIGlzRmlsZURpYWxvZ0FjdGl2ZSwgb25GaWxlRGlhbG9nQ2FuY2VsQ2IsIGZzQWNjZXNzQXBpV29ya3NSZWZdKTtcbiAgdmFyIGRyYWdUYXJnZXRzUmVmID0gdXNlUmVmKFtdKTtcbiAgdmFyIGdsb2JhbERyYWdUYXJnZXRzUmVmID0gdXNlUmVmKFtdKTtcblxuICB2YXIgb25Eb2N1bWVudERyb3AgPSBmdW5jdGlvbiBvbkRvY3VtZW50RHJvcChldmVudCkge1xuICAgIGlmIChyb290UmVmLmN1cnJlbnQgJiYgcm9vdFJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIC8vIElmIHdlIGludGVyY2VwdGVkIGFuIGV2ZW50IGZvciBvdXIgaW5zdGFuY2UsIGxldCBpdCBwcm9wYWdhdGUgZG93biB0byB0aGUgaW5zdGFuY2UncyBvbkRyb3AgaGFuZGxlclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdO1xuICB9O1xuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHByZXZlbnREcm9wT25Eb2N1bWVudCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG9uRG9jdW1lbnREcmFnT3ZlciwgZmFsc2UpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgb25Eb2N1bWVudERyb3AsIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHByZXZlbnREcm9wT25Eb2N1bWVudCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgb25Eb2N1bWVudERyYWdPdmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgb25Eb2N1bWVudERyb3ApO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtyb290UmVmLCBwcmV2ZW50RHJvcE9uRG9jdW1lbnRdKTsgLy8gVHJhY2sgZ2xvYmFsIGRyYWcgc3RhdGUgZm9yIGRvY3VtZW50LWxldmVsIGRyYWcgZXZlbnRzXG5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb25Eb2N1bWVudERyYWdFbnRlciA9IGZ1bmN0aW9uIG9uRG9jdW1lbnREcmFnRW50ZXIoZXZlbnQpIHtcbiAgICAgIGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQpLCBbZXZlbnQudGFyZ2V0XSk7XG5cbiAgICAgIGlmIChpc0V2dFdpdGhGaWxlcyhldmVudCkpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIGlzRHJhZ0dsb2JhbDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiBcInNldERyYWdHbG9iYWxcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uRG9jdW1lbnREcmFnTGVhdmUgPSBmdW5jdGlvbiBvbkRvY3VtZW50RHJhZ0xlYXZlKGV2ZW50KSB7XG4gICAgICAvLyBPbmx5IGRlYWN0aXZhdGUgb25jZSB3ZSd2ZSBsZWZ0IGFsbCBjaGlsZHJlblxuICAgICAgZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IGdsb2JhbERyYWdUYXJnZXRzUmVmLmN1cnJlbnQuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWwgIT09IGV2ZW50LnRhcmdldCAmJiBlbCAhPT0gbnVsbDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICBpc0RyYWdHbG9iYWw6IGZhbHNlLFxuICAgICAgICB0eXBlOiBcInNldERyYWdHbG9iYWxcIlxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBvbkRvY3VtZW50RHJhZ0VuZCA9IGZ1bmN0aW9uIG9uRG9jdW1lbnREcmFnRW5kKCkge1xuICAgICAgZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICBpc0RyYWdHbG9iYWw6IGZhbHNlLFxuICAgICAgICB0eXBlOiBcInNldERyYWdHbG9iYWxcIlxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBvbkRvY3VtZW50RHJvcEdsb2JhbCA9IGZ1bmN0aW9uIG9uRG9jdW1lbnREcm9wR2xvYmFsKCkge1xuICAgICAgZ2xvYmFsRHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICBpc0RyYWdHbG9iYWw6IGZhbHNlLFxuICAgICAgICB0eXBlOiBcInNldERyYWdHbG9iYWxcIlxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIiwgb25Eb2N1bWVudERyYWdFbnRlciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgb25Eb2N1bWVudERyYWdMZWF2ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsIG9uRG9jdW1lbnREcmFnRW5kLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgb25Eb2N1bWVudERyb3BHbG9iYWwsIGZhbHNlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBvbkRvY3VtZW50RHJhZ0VudGVyKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgb25Eb2N1bWVudERyYWdMZWF2ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBvbkRvY3VtZW50RHJhZ0VuZCk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBvbkRvY3VtZW50RHJvcEdsb2JhbCk7XG4gICAgfTtcbiAgfSwgW3Jvb3RSZWZdKTsgLy8gQXV0byBmb2N1cyB0aGUgcm9vdCB3aGVuIGF1dG9Gb2N1cyBpcyB0cnVlXG5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWRpc2FibGVkICYmIGF1dG9Gb2N1cyAmJiByb290UmVmLmN1cnJlbnQpIHtcbiAgICAgIHJvb3RSZWYuY3VycmVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fTtcbiAgfSwgW3Jvb3RSZWYsIGF1dG9Gb2N1cywgZGlzYWJsZWRdKTtcbiAgdmFyIG9uRXJyQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZSkge1xuICAgIGlmIChvbkVycm9yKSB7XG4gICAgICBvbkVycm9yKGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBMZXQgdGhlIHVzZXIga25vdyBzb21ldGhpbmcncyBnb25lIHdyb25nIGlmIHRoZXkgaGF2ZW4ndCBwcm92aWRlZCB0aGUgb25FcnJvciBjYi5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9LCBbb25FcnJvcl0pO1xuICB2YXIgb25EcmFnRW50ZXJDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFBlcnNpc3QgaGVyZSBiZWNhdXNlIHdlIG5lZWQgdGhlIGV2ZW50IGxhdGVyIGFmdGVyIGdldEZpbGVzRnJvbUV2ZW50KCkgaXMgZG9uZVxuXG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHN0b3BQcm9wYWdhdGlvbihldmVudCk7XG4gICAgZHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoZHJhZ1RhcmdldHNSZWYuY3VycmVudCksIFtldmVudC50YXJnZXRdKTtcblxuICAgIGlmIChpc0V2dFdpdGhGaWxlcyhldmVudCkpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZShnZXRGaWxlc0Zyb21FdmVudChldmVudCkpLnRoZW4oZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgIGlmIChpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCkgJiYgIW5vRHJhZ0V2ZW50c0J1YmJsaW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGVDb3VudCA9IGZpbGVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGlzRHJhZ0FjY2VwdCA9IGZpbGVDb3VudCA+IDAgJiYgYWxsRmlsZXNBY2NlcHRlZCh7XG4gICAgICAgICAgZmlsZXM6IGZpbGVzLFxuICAgICAgICAgIGFjY2VwdDogYWNjZXB0QXR0cixcbiAgICAgICAgICBtaW5TaXplOiBtaW5TaXplLFxuICAgICAgICAgIG1heFNpemU6IG1heFNpemUsXG4gICAgICAgICAgbXVsdGlwbGU6IG11bHRpcGxlLFxuICAgICAgICAgIG1heEZpbGVzOiBtYXhGaWxlcyxcbiAgICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvclxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGlzRHJhZ1JlamVjdCA9IGZpbGVDb3VudCA+IDAgJiYgIWlzRHJhZ0FjY2VwdDtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIGlzRHJhZ0FjY2VwdDogaXNEcmFnQWNjZXB0LFxuICAgICAgICAgIGlzRHJhZ1JlamVjdDogaXNEcmFnUmVqZWN0LFxuICAgICAgICAgIGlzRHJhZ0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiBcInNldERyYWdnZWRGaWxlc1wiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChvbkRyYWdFbnRlcikge1xuICAgICAgICAgIG9uRHJhZ0VudGVyKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIG9uRXJyQ2IoZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFtnZXRGaWxlc0Zyb21FdmVudCwgb25EcmFnRW50ZXIsIG9uRXJyQ2IsIG5vRHJhZ0V2ZW50c0J1YmJsaW5nLCBhY2NlcHRBdHRyLCBtaW5TaXplLCBtYXhTaXplLCBtdWx0aXBsZSwgbWF4RmlsZXMsIHZhbGlkYXRvcl0pO1xuICB2YXIgb25EcmFnT3ZlckNiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgc3RvcFByb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICB2YXIgaGFzRmlsZXMgPSBpc0V2dFdpdGhGaWxlcyhldmVudCk7XG5cbiAgICBpZiAoaGFzRmlsZXMgJiYgZXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuICAgICAgfSBjYXRjaCAoX3VudXNlZCkge31cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZW1wdHkgKi9cblxuICAgIH1cblxuICAgIGlmIChoYXNGaWxlcyAmJiBvbkRyYWdPdmVyKSB7XG4gICAgICBvbkRyYWdPdmVyKGV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sIFtvbkRyYWdPdmVyLCBub0RyYWdFdmVudHNCdWJibGluZ10pO1xuICB2YXIgb25EcmFnTGVhdmVDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHN0b3BQcm9wYWdhdGlvbihldmVudCk7IC8vIE9ubHkgZGVhY3RpdmF0ZSBvbmNlIHRoZSBkcm9wem9uZSBhbmQgYWxsIGNoaWxkcmVuIGhhdmUgYmVlbiBsZWZ0XG5cbiAgICB2YXIgdGFyZ2V0cyA9IGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQuZmlsdGVyKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiByb290UmVmLmN1cnJlbnQgJiYgcm9vdFJlZi5jdXJyZW50LmNvbnRhaW5zKHRhcmdldCk7XG4gICAgfSk7IC8vIE1ha2Ugc3VyZSB0byByZW1vdmUgYSB0YXJnZXQgcHJlc2VudCBtdWx0aXBsZSB0aW1lcyBvbmx5IG9uY2VcbiAgICAvLyAoRmlyZWZveCBtYXkgZmlyZSBkcmFnZW50ZXIvZHJhZ2xlYXZlIG11bHRpcGxlIHRpbWVzIG9uIHRoZSBzYW1lIGVsZW1lbnQpXG5cbiAgICB2YXIgdGFyZ2V0SWR4ID0gdGFyZ2V0cy5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG5cbiAgICBpZiAodGFyZ2V0SWR4ICE9PSAtMSkge1xuICAgICAgdGFyZ2V0cy5zcGxpY2UodGFyZ2V0SWR4LCAxKTtcbiAgICB9XG5cbiAgICBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gdGFyZ2V0cztcblxuICAgIGlmICh0YXJnZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBcInNldERyYWdnZWRGaWxlc1wiLFxuICAgICAgaXNEcmFnQWN0aXZlOiBmYWxzZSxcbiAgICAgIGlzRHJhZ0FjY2VwdDogZmFsc2UsXG4gICAgICBpc0RyYWdSZWplY3Q6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBpZiAoaXNFdnRXaXRoRmlsZXMoZXZlbnQpICYmIG9uRHJhZ0xlYXZlKSB7XG4gICAgICBvbkRyYWdMZWF2ZShldmVudCk7XG4gICAgfVxuICB9LCBbcm9vdFJlZiwgb25EcmFnTGVhdmUsIG5vRHJhZ0V2ZW50c0J1YmJsaW5nXSk7XG4gIHZhciBzZXRGaWxlcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChmaWxlcywgZXZlbnQpIHtcbiAgICB2YXIgYWNjZXB0ZWRGaWxlcyA9IFtdO1xuICAgIHZhciBmaWxlUmVqZWN0aW9ucyA9IFtdO1xuICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgIHZhciBfZmlsZUFjY2VwdGVkID0gZmlsZUFjY2VwdGVkKGZpbGUsIGFjY2VwdEF0dHIpLFxuICAgICAgICAgIF9maWxlQWNjZXB0ZWQyID0gX3NsaWNlZFRvQXJyYXkoX2ZpbGVBY2NlcHRlZCwgMiksXG4gICAgICAgICAgYWNjZXB0ZWQgPSBfZmlsZUFjY2VwdGVkMlswXSxcbiAgICAgICAgICBhY2NlcHRFcnJvciA9IF9maWxlQWNjZXB0ZWQyWzFdO1xuXG4gICAgICB2YXIgX2ZpbGVNYXRjaFNpemUgPSBmaWxlTWF0Y2hTaXplKGZpbGUsIG1pblNpemUsIG1heFNpemUpLFxuICAgICAgICAgIF9maWxlTWF0Y2hTaXplMiA9IF9zbGljZWRUb0FycmF5KF9maWxlTWF0Y2hTaXplLCAyKSxcbiAgICAgICAgICBzaXplTWF0Y2ggPSBfZmlsZU1hdGNoU2l6ZTJbMF0sXG4gICAgICAgICAgc2l6ZUVycm9yID0gX2ZpbGVNYXRjaFNpemUyWzFdO1xuXG4gICAgICB2YXIgY3VzdG9tRXJyb3JzID0gdmFsaWRhdG9yID8gdmFsaWRhdG9yKGZpbGUpIDogbnVsbDtcblxuICAgICAgaWYgKGFjY2VwdGVkICYmIHNpemVNYXRjaCAmJiAhY3VzdG9tRXJyb3JzKSB7XG4gICAgICAgIGFjY2VwdGVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBlcnJvcnMgPSBbYWNjZXB0RXJyb3IsIHNpemVFcnJvcl07XG5cbiAgICAgICAgaWYgKGN1c3RvbUVycm9ycykge1xuICAgICAgICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQoY3VzdG9tRXJyb3JzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVSZWplY3Rpb25zLnB1c2goe1xuICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgZXJyb3JzOiBlcnJvcnMuZmlsdGVyKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghbXVsdGlwbGUgJiYgYWNjZXB0ZWRGaWxlcy5sZW5ndGggPiAxIHx8IG11bHRpcGxlICYmIG1heEZpbGVzID49IDEgJiYgYWNjZXB0ZWRGaWxlcy5sZW5ndGggPiBtYXhGaWxlcykge1xuICAgICAgLy8gUmVqZWN0IGV2ZXJ5dGhpbmcgYW5kIGVtcHR5IGFjY2VwdGVkIGZpbGVzXG4gICAgICBhY2NlcHRlZEZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgZmlsZVJlamVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICBlcnJvcnM6IFtUT09fTUFOWV9GSUxFU19SRUpFQ1RJT05dXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBhY2NlcHRlZEZpbGVzLnNwbGljZSgwKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICBhY2NlcHRlZEZpbGVzOiBhY2NlcHRlZEZpbGVzLFxuICAgICAgZmlsZVJlamVjdGlvbnM6IGZpbGVSZWplY3Rpb25zLFxuICAgICAgdHlwZTogXCJzZXRGaWxlc1wiXG4gICAgfSk7XG5cbiAgICBpZiAob25Ecm9wKSB7XG4gICAgICBvbkRyb3AoYWNjZXB0ZWRGaWxlcywgZmlsZVJlamVjdGlvbnMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZVJlamVjdGlvbnMubGVuZ3RoID4gMCAmJiBvbkRyb3BSZWplY3RlZCkge1xuICAgICAgb25Ecm9wUmVqZWN0ZWQoZmlsZVJlamVjdGlvbnMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoYWNjZXB0ZWRGaWxlcy5sZW5ndGggPiAwICYmIG9uRHJvcEFjY2VwdGVkKSB7XG4gICAgICBvbkRyb3BBY2NlcHRlZChhY2NlcHRlZEZpbGVzLCBldmVudCk7XG4gICAgfVxuICB9LCBbZGlzcGF0Y2gsIG11bHRpcGxlLCBhY2NlcHRBdHRyLCBtaW5TaXplLCBtYXhTaXplLCBtYXhGaWxlcywgb25Ecm9wLCBvbkRyb3BBY2NlcHRlZCwgb25Ecm9wUmVqZWN0ZWQsIHZhbGlkYXRvcl0pO1xuICB2YXIgb25Ecm9wQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQZXJzaXN0IGhlcmUgYmVjYXVzZSB3ZSBuZWVkIHRoZSBldmVudCBsYXRlciBhZnRlciBnZXRGaWxlc0Zyb21FdmVudCgpIGlzIGRvbmVcblxuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICBzdG9wUHJvcGFnYXRpb24oZXZlbnQpO1xuICAgIGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXTtcblxuICAgIGlmIChpc0V2dFdpdGhGaWxlcyhldmVudCkpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZShnZXRGaWxlc0Zyb21FdmVudChldmVudCkpLnRoZW4oZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgIGlmIChpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCkgJiYgIW5vRHJhZ0V2ZW50c0J1YmJsaW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RmlsZXMoZmlsZXMsIGV2ZW50KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBvbkVyckNiKGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJyZXNldFwiXG4gICAgfSk7XG4gIH0sIFtnZXRGaWxlc0Zyb21FdmVudCwgc2V0RmlsZXMsIG9uRXJyQ2IsIG5vRHJhZ0V2ZW50c0J1YmJsaW5nXSk7IC8vIEZuIGZvciBvcGVuaW5nIHRoZSBmaWxlIGRpYWxvZyBwcm9ncmFtbWF0aWNhbGx5XG5cbiAgdmFyIG9wZW5GaWxlRGlhbG9nID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIC8vIE5vIHBvaW50IHRvIHVzZSBGUyBhY2Nlc3MgQVBJcyBpZiBjb250ZXh0IGlzIG5vdCBzZWN1cmVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TZWN1cml0eS9TZWN1cmVfQ29udGV4dHMjZmVhdHVyZV9kZXRlY3Rpb25cbiAgICBpZiAoZnNBY2Nlc3NBcGlXb3Jrc1JlZi5jdXJyZW50KSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFwib3BlbkRpYWxvZ1wiXG4gICAgICB9KTtcbiAgICAgIG9uRmlsZURpYWxvZ09wZW5DYigpOyAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3Nob3dPcGVuRmlsZVBpY2tlclxuXG4gICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgbXVsdGlwbGU6IG11bHRpcGxlLFxuICAgICAgICB0eXBlczogcGlja2VyVHlwZXNcbiAgICAgIH07XG4gICAgICB3aW5kb3cuc2hvd09wZW5GaWxlUGlja2VyKG9wdHMpLnRoZW4oZnVuY3Rpb24gKGhhbmRsZXMpIHtcbiAgICAgICAgcmV0dXJuIGdldEZpbGVzRnJvbUV2ZW50KGhhbmRsZXMpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgc2V0RmlsZXMoZmlsZXMsIG51bGwpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogXCJjbG9zZURpYWxvZ1wiXG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gQWJvcnRFcnJvciBtZWFucyB0aGUgdXNlciBjYW5jZWxlZFxuICAgICAgICBpZiAoaXNBYm9ydChlKSkge1xuICAgICAgICAgIG9uRmlsZURpYWxvZ0NhbmNlbENiKGUpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2xvc2VEaWFsb2dcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGlzU2VjdXJpdHlFcnJvcihlKSkge1xuICAgICAgICAgIGZzQWNjZXNzQXBpV29ya3NSZWYuY3VycmVudCA9IGZhbHNlOyAvLyBDT1JTLCBzbyBjYW5ub3QgdXNlIHRoaXMgQVBJXG4gICAgICAgICAgLy8gVHJ5IHVzaW5nIHRoZSBpbnB1dFxuXG4gICAgICAgICAgaWYgKGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIGlucHV0UmVmLmN1cnJlbnQudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgaW5wdXRSZWYuY3VycmVudC5jbGljaygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkVyckNiKG5ldyBFcnJvcihcIkNhbm5vdCBvcGVuIHRoZSBmaWxlIHBpY2tlciBiZWNhdXNlIHRoZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZV9TeXN0ZW1fQWNjZXNzX0FQSSBpcyBub3Qgc3VwcG9ydGVkIGFuZCBubyA8aW5wdXQ+IHdhcyBwcm92aWRlZC5cIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbkVyckNiKGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcIm9wZW5EaWFsb2dcIlxuICAgICAgfSk7XG4gICAgICBvbkZpbGVEaWFsb2dPcGVuQ2IoKTtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQudmFsdWUgPSBudWxsO1xuICAgICAgaW5wdXRSZWYuY3VycmVudC5jbGljaygpO1xuICAgIH1cbiAgfSwgW2Rpc3BhdGNoLCBvbkZpbGVEaWFsb2dPcGVuQ2IsIG9uRmlsZURpYWxvZ0NhbmNlbENiLCB1c2VGc0FjY2Vzc0FwaSwgc2V0RmlsZXMsIG9uRXJyQ2IsIHBpY2tlclR5cGVzLCBtdWx0aXBsZV0pOyAvLyBDYiB0byBvcGVuIHRoZSBmaWxlIGRpYWxvZyB3aGVuIFNQQUNFL0VOVEVSIG9jY3VycyBvbiB0aGUgZHJvcHpvbmVcblxuICB2YXIgb25LZXlEb3duQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAvLyBJZ25vcmUga2V5Ym9hcmQgZXZlbnRzIGJ1YmJsaW5nIHVwIHRoZSBET00gdHJlZVxuICAgIGlmICghcm9vdFJlZi5jdXJyZW50IHx8ICFyb290UmVmLmN1cnJlbnQuaXNFcXVhbE5vZGUoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXkgPT09IFwiIFwiIHx8IGV2ZW50LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2ZW50LmtleUNvZGUgPT09IDMyIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgb3BlbkZpbGVEaWFsb2coKTtcbiAgICB9XG4gIH0sIFtyb290UmVmLCBvcGVuRmlsZURpYWxvZ10pOyAvLyBVcGRhdGUgZm9jdXMgc3RhdGUgZm9yIHRoZSBkcm9wem9uZVxuXG4gIHZhciBvbkZvY3VzQ2IgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogXCJmb2N1c1wiXG4gICAgfSk7XG4gIH0sIFtdKTtcbiAgdmFyIG9uQmx1ckNiID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFwiYmx1clwiXG4gICAgfSk7XG4gIH0sIFtdKTsgLy8gQ2IgdG8gb3BlbiB0aGUgZmlsZSBkaWFsb2cgd2hlbiBjbGljayBvY2N1cnMgb24gdGhlIGRyb3B6b25lXG5cbiAgdmFyIG9uQ2xpY2tDYiA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobm9DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gSW4gSUUxMS9FZGdlIHRoZSBmaWxlLWJyb3dzZXIgZGlhbG9nIGlzIGJsb2NraW5nLCB0aGVyZWZvcmUsIHVzZSBzZXRUaW1lb3V0KClcbiAgICAvLyB0byBlbnN1cmUgUmVhY3QgY2FuIGhhbmRsZSBzdGF0ZSBjaGFuZ2VzXG4gICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vcmVhY3QtZHJvcHpvbmUvcmVhY3QtZHJvcHpvbmUvaXNzdWVzLzQ1MFxuXG5cbiAgICBpZiAoaXNJZU9yRWRnZSgpKSB7XG4gICAgICBzZXRUaW1lb3V0KG9wZW5GaWxlRGlhbG9nLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3BlbkZpbGVEaWFsb2coKTtcbiAgICB9XG4gIH0sIFtub0NsaWNrLCBvcGVuRmlsZURpYWxvZ10pO1xuXG4gIHZhciBjb21wb3NlSGFuZGxlciA9IGZ1bmN0aW9uIGNvbXBvc2VIYW5kbGVyKGZuKSB7XG4gICAgcmV0dXJuIGRpc2FibGVkID8gbnVsbCA6IGZuO1xuICB9O1xuXG4gIHZhciBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyID0gZnVuY3Rpb24gY29tcG9zZUtleWJvYXJkSGFuZGxlcihmbikge1xuICAgIHJldHVybiBub0tleWJvYXJkID8gbnVsbCA6IGNvbXBvc2VIYW5kbGVyKGZuKTtcbiAgfTtcblxuICB2YXIgY29tcG9zZURyYWdIYW5kbGVyID0gZnVuY3Rpb24gY29tcG9zZURyYWdIYW5kbGVyKGZuKSB7XG4gICAgcmV0dXJuIG5vRHJhZyA/IG51bGwgOiBjb21wb3NlSGFuZGxlcihmbik7XG4gIH07XG5cbiAgdmFyIHN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uIHN0b3BQcm9wYWdhdGlvbihldmVudCkge1xuICAgIGlmIChub0RyYWdFdmVudHNCdWJibGluZykge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRSb290UHJvcHMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9yZWYyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgICBfcmVmMiRyZWZLZXkgPSBfcmVmMi5yZWZLZXksXG4gICAgICAgICAgcmVmS2V5ID0gX3JlZjIkcmVmS2V5ID09PSB2b2lkIDAgPyBcInJlZlwiIDogX3JlZjIkcmVmS2V5LFxuICAgICAgICAgIHJvbGUgPSBfcmVmMi5yb2xlLFxuICAgICAgICAgIG9uS2V5RG93biA9IF9yZWYyLm9uS2V5RG93bixcbiAgICAgICAgICBvbkZvY3VzID0gX3JlZjIub25Gb2N1cyxcbiAgICAgICAgICBvbkJsdXIgPSBfcmVmMi5vbkJsdXIsXG4gICAgICAgICAgb25DbGljayA9IF9yZWYyLm9uQ2xpY2ssXG4gICAgICAgICAgb25EcmFnRW50ZXIgPSBfcmVmMi5vbkRyYWdFbnRlcixcbiAgICAgICAgICBvbkRyYWdPdmVyID0gX3JlZjIub25EcmFnT3ZlcixcbiAgICAgICAgICBvbkRyYWdMZWF2ZSA9IF9yZWYyLm9uRHJhZ0xlYXZlLFxuICAgICAgICAgIG9uRHJvcCA9IF9yZWYyLm9uRHJvcCxcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYyLCBfZXhjbHVkZWQzKTtcblxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZChfZGVmaW5lUHJvcGVydHkoe1xuICAgICAgICBvbktleURvd246IGNvbXBvc2VLZXlib2FyZEhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25LZXlEb3duLCBvbktleURvd25DYikpLFxuICAgICAgICBvbkZvY3VzOiBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRm9jdXMsIG9uRm9jdXNDYikpLFxuICAgICAgICBvbkJsdXI6IGNvbXBvc2VLZXlib2FyZEhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25CbHVyLCBvbkJsdXJDYikpLFxuICAgICAgICBvbkNsaWNrOiBjb21wb3NlSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBvbkNsaWNrQ2IpKSxcbiAgICAgICAgb25EcmFnRW50ZXI6IGNvbXBvc2VEcmFnSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkRyYWdFbnRlciwgb25EcmFnRW50ZXJDYikpLFxuICAgICAgICBvbkRyYWdPdmVyOiBjb21wb3NlRHJhZ0hhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25EcmFnT3Zlciwgb25EcmFnT3ZlckNiKSksXG4gICAgICAgIG9uRHJhZ0xlYXZlOiBjb21wb3NlRHJhZ0hhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25EcmFnTGVhdmUsIG9uRHJhZ0xlYXZlQ2IpKSxcbiAgICAgICAgb25Ecm9wOiBjb21wb3NlRHJhZ0hhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25Ecm9wLCBvbkRyb3BDYikpLFxuICAgICAgICByb2xlOiB0eXBlb2Ygcm9sZSA9PT0gXCJzdHJpbmdcIiAmJiByb2xlICE9PSBcIlwiID8gcm9sZSA6IFwicHJlc2VudGF0aW9uXCJcbiAgICAgIH0sIHJlZktleSwgcm9vdFJlZiksICFkaXNhYmxlZCAmJiAhbm9LZXlib2FyZCA/IHtcbiAgICAgICAgdGFiSW5kZXg6IDBcbiAgICAgIH0gOiB7fSksIHJlc3QpO1xuICAgIH07XG4gIH0sIFtyb290UmVmLCBvbktleURvd25DYiwgb25Gb2N1c0NiLCBvbkJsdXJDYiwgb25DbGlja0NiLCBvbkRyYWdFbnRlckNiLCBvbkRyYWdPdmVyQ2IsIG9uRHJhZ0xlYXZlQ2IsIG9uRHJvcENiLCBub0tleWJvYXJkLCBub0RyYWcsIGRpc2FibGVkXSk7XG4gIHZhciBvbklucHV0RWxlbWVudENsaWNrID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0sIFtdKTtcbiAgdmFyIGdldElucHV0UHJvcHMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9yZWYzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgICBfcmVmMyRyZWZLZXkgPSBfcmVmMy5yZWZLZXksXG4gICAgICAgICAgcmVmS2V5ID0gX3JlZjMkcmVmS2V5ID09PSB2b2lkIDAgPyBcInJlZlwiIDogX3JlZjMkcmVmS2V5LFxuICAgICAgICAgIG9uQ2hhbmdlID0gX3JlZjMub25DaGFuZ2UsXG4gICAgICAgICAgb25DbGljayA9IF9yZWYzLm9uQ2xpY2ssXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmMywgX2V4Y2x1ZGVkNCk7XG5cbiAgICAgIHZhciBpbnB1dFByb3BzID0gX2RlZmluZVByb3BlcnR5KHtcbiAgICAgICAgYWNjZXB0OiBhY2NlcHRBdHRyLFxuICAgICAgICBtdWx0aXBsZTogbXVsdGlwbGUsXG4gICAgICAgIHR5cGU6IFwiZmlsZVwiLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICBjbGlwOiBcInJlY3QoMCwgMCwgMCwgMClcIixcbiAgICAgICAgICBjbGlwUGF0aDogXCJpbnNldCg1MCUpXCIsXG4gICAgICAgICAgaGVpZ2h0OiBcIjFweFwiLFxuICAgICAgICAgIG1hcmdpbjogXCIwIC0xcHggLTFweCAwXCIsXG4gICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIHdpZHRoOiBcIjFweFwiLFxuICAgICAgICAgIHdoaXRlU3BhY2U6IFwibm93cmFwXCJcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGNvbXBvc2VIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uQ2hhbmdlLCBvbkRyb3BDYikpLFxuICAgICAgICBvbkNsaWNrOiBjb21wb3NlSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBvbklucHV0RWxlbWVudENsaWNrKSksXG4gICAgICAgIHRhYkluZGV4OiAtMVxuICAgICAgfSwgcmVmS2V5LCBpbnB1dFJlZik7XG5cbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIGlucHV0UHJvcHMpLCByZXN0KTtcbiAgICB9O1xuICB9LCBbaW5wdXRSZWYsIGFjY2VwdCwgbXVsdGlwbGUsIG9uRHJvcENiLCBkaXNhYmxlZF0pO1xuICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgaXNGb2N1c2VkOiBpc0ZvY3VzZWQgJiYgIWRpc2FibGVkLFxuICAgIGdldFJvb3RQcm9wczogZ2V0Um9vdFByb3BzLFxuICAgIGdldElucHV0UHJvcHM6IGdldElucHV0UHJvcHMsXG4gICAgcm9vdFJlZjogcm9vdFJlZixcbiAgICBpbnB1dFJlZjogaW5wdXRSZWYsXG4gICAgb3BlbjogY29tcG9zZUhhbmRsZXIob3BlbkZpbGVEaWFsb2cpXG4gIH0pO1xufVxuLyoqXG4gKiBAcGFyYW0ge0Ryb3B6b25lU3RhdGV9IHN0YXRlXG4gKiBAcGFyYW0ge3t0eXBlOiBzdHJpbmd9ICYgRHJvcHpvbmVTdGF0ZX0gYWN0aW9uXG4gKiBAcmV0dXJucyB7RHJvcHpvbmVTdGF0ZX1cbiAqL1xuXG5mdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgXCJmb2N1c1wiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBpc0ZvY3VzZWQ6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcImJsdXJcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgaXNGb2N1c2VkOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwib3BlbkRpYWxvZ1wiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgaW5pdGlhbFN0YXRlKSwge30sIHtcbiAgICAgICAgaXNGaWxlRGlhbG9nQWN0aXZlOiB0cnVlXG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJjbG9zZURpYWxvZ1wiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBpc0ZpbGVEaWFsb2dBY3RpdmU6IGZhbHNlXG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJzZXREcmFnZ2VkRmlsZXNcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgaXNEcmFnQWN0aXZlOiBhY3Rpb24uaXNEcmFnQWN0aXZlLFxuICAgICAgICBpc0RyYWdBY2NlcHQ6IGFjdGlvbi5pc0RyYWdBY2NlcHQsXG4gICAgICAgIGlzRHJhZ1JlamVjdDogYWN0aW9uLmlzRHJhZ1JlamVjdFxuICAgICAgfSk7XG5cbiAgICBjYXNlIFwic2V0RmlsZXNcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgYWNjZXB0ZWRGaWxlczogYWN0aW9uLmFjY2VwdGVkRmlsZXMsXG4gICAgICAgIGZpbGVSZWplY3Rpb25zOiBhY3Rpb24uZmlsZVJlamVjdGlvbnMsXG4gICAgICAgIGlzRHJhZ1JlamVjdDogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBcInNldERyYWdHbG9iYWxcIjpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgaXNEcmFnR2xvYmFsOiBhY3Rpb24uaXNEcmFnR2xvYmFsXG4gICAgICB9KTtcblxuICAgIGNhc2UgXCJyZXNldFwiOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoe30sIGluaXRpYWxTdGF0ZSk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5leHBvcnQgeyBFcnJvckNvZGUgfSBmcm9tIFwiLi91dGlscy9pbmRleC5qc1wiOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VEcm9wem9uZSB9IGZyb20gJ3JlYWN0LWRyb3B6b25lJztcbmltcG9ydCB7IEJveCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgSU1BR0VfQUNDRVBUX01BUCB9IGZyb20gJy4uLy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcbnR5cGUgSW1hZ2VVcGxvYWREcm9wem9uZVByb3BzID0ge1xuICBtdWx0aXBsZTogYm9vbGVhbjtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIG9uRHJvcEFjY2VwdGVkOiAoZmlsZXM6IEZpbGVbXSkgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBJbWFnZVVwbG9hZERyb3B6b25lOiBSZWFjdC5GQzxJbWFnZVVwbG9hZERyb3B6b25lUHJvcHM+ID0gKHtcbiAgbXVsdGlwbGUsXG4gIGRpc2FibGVkLFxuICBvbkRyb3BBY2NlcHRlZCxcbn0pID0+IHtcbiAgY29uc3QgeyBnZXRSb290UHJvcHMsIGdldElucHV0UHJvcHMsIGlzRHJhZ0FjdGl2ZSB9ID0gdXNlRHJvcHpvbmUoe1xuICAgIGFjY2VwdDogSU1BR0VfQUNDRVBUX01BUCxcbiAgICBtdWx0aXBsZSxcbiAgICBkaXNhYmxlZCxcbiAgICBvbkRyb3BBY2NlcHRlZDogKGFjY2VwdGVkRmlsZXMpID0+IHZvaWQgb25Ecm9wQWNjZXB0ZWQoYWNjZXB0ZWRGaWxlcyksXG4gICAgbm9DbGljazogZmFsc2UsXG4gICAgbm9LZXlib2FyZDogZmFsc2UsXG4gIH0pO1xuXG4gIGNvbnN0IGhpbnQgPSBpc0RyYWdBY3RpdmVcbiAgICA/ICdEcm9wIHRoZSBpbWFnZXMgaGVyZS4uLidcbiAgICA6ICdEcmFnICYgZHJvcCBpbWFnZXMgaGVyZSwgb3IgY2xpY2sgdG8gc2VsZWN0JztcblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHsuLi5nZXRSb290UHJvcHMoKX1cbiAgICAgIHBhZGRpbmc9XCJkZWZhdWx0XCJcbiAgICAgIGJvcmRlcj1cImRlZmF1bHRcIlxuICAgICAgYm9yZGVyUmFkaXVzPVwiZGVmYXVsdFwiXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I9e2lzRHJhZ0FjdGl2ZSA/ICdncmV5MjAnIDogJ3doaXRlJ31cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGN1cnNvcjogZGlzYWJsZWQgPyAnbm90LWFsbG93ZWQnIDogJ3BvaW50ZXInLFxuICAgICAgICBib3JkZXJTdHlsZTogJ2Rhc2hlZCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGlucHV0IHsuLi5nZXRJbnB1dFByb3BzKCl9IC8+XG4gICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIj5cbiAgICAgICAge2hpbnR9XG4gICAgICA8L1RleHQ+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgTG9hZGVyIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBVUExPQURJTkdfUFJFVklFV19TVFlMRSB9IGZyb20gJy4uLy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcblxudHlwZSBJbWFnZVVwbG9hZFByZXZpZXdTdHJpcFByb3BzID0ge1xuICBwcmV2aWV3VXJsczogc3RyaW5nW107XG59O1xuXG5leHBvcnQgY29uc3QgSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXA6IFJlYWN0LkZDPFxuICBJbWFnZVVwbG9hZFByZXZpZXdTdHJpcFByb3BzXG4+ID0gKHsgcHJldmlld1VybHMgfSkgPT4ge1xuICBpZiAocHJldmlld1VybHMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggbXQ9XCJkZWZhdWx0XCIgZGlzcGxheT1cImZsZXhcIiBmbGV4V3JhcD1cIndyYXBcIiBnYXA9XCJkZWZhdWx0XCI+XG4gICAgICB7cHJldmlld1VybHMubWFwKCh1cmwpID0+IChcbiAgICAgICAgPEJveFxuICAgICAgICAgIGtleT17dXJsfVxuICAgICAgICAgIHBvc2l0aW9uPVwicmVsYXRpdmVcIlxuICAgICAgICAgIG1iPVwic21cIlxuICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgICAgICBnYXA9XCJkZWZhdWx0XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxpbWcgc3JjPXt1cmx9IGFsdD1cIlwiIHN0eWxlPXtVUExPQURJTkdfUFJFVklFV19TVFlMRX0gLz5cbiAgICAgICAgICA8Qm94XG4gICAgICAgICAgICBwb3NpdGlvbj1cImFic29sdXRlXCJcbiAgICAgICAgICAgIHRvcD17MH1cbiAgICAgICAgICAgIGxlZnQ9ezB9XG4gICAgICAgICAgICByaWdodD17MH1cbiAgICAgICAgICAgIGJvdHRvbT17MH1cbiAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIlxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yPVwicmdiYSgyNTUsMjU1LDI1NSwwLjcpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TG9hZGVyIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgIDwvQm94PlxuICAgICAgKSl9XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIFRleHQsIExvYWRlciB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgVEhVTUJfU0laRSB9IGZyb20gJy4uLy4uL3V0aWxzL2ltYWdlLXVwbG9hZC9pbWFnZS11cGxvYWQtZmllbGQuY29uc3RhbnRzJztcblxudHlwZSBJbWFnZVVwbG9hZFRodW1ibmFpbFByb3BzID0ge1xuICB1cmw6IHN0cmluZztcbiAgdmFyaWFudDogJ2VkaXQnIHwgJ3Nob3cnO1xuICBpbmRleDogbnVtYmVyO1xuICBvblJlbW92ZT86IChpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xufTtcblxuY29uc3QgQ0FSRF9TVFlMRSA9IHtcbiAgd2lkdGg6IFRIVU1CX1NJWkUsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyBhcyBjb25zdCxcbiAgYm9yZGVyUmFkaXVzOiA4LFxuICBib3JkZXI6ICcxcHggc29saWQgI2UwZTBlMCcsXG4gIGJhY2tncm91bmRDb2xvcjogJyNmNWY1ZjUnLFxufTtcblxuY29uc3QgSU1HX0NPTlRBSU5FUl9TVFlMRSA9IHtcbiAgd2lkdGg6IFRIVU1CX1NJWkUsXG4gIGhlaWdodDogVEhVTUJfU0laRSxcbiAgZGlzcGxheTogJ2Jsb2NrJyxcbn07XG5cbmNvbnN0IElNR19TVFlMRSA9IHtcbiAgd2lkdGg6IFRIVU1CX1NJWkUsXG4gIGhlaWdodDogVEhVTUJfU0laRSxcbiAgb2JqZWN0Rml0OiAnY292ZXInIGFzIGNvbnN0LFxuICBkaXNwbGF5OiAnYmxvY2snLFxufTtcblxudHlwZSBUaHVtYm5haWxPdmVybGF5U3RhdHVzID0gJ2xvYWRpbmcnIHwgJ2xvYWRlZCcgfCAnZXJyb3InO1xuXG5mdW5jdGlvbiBUaHVtYm5haWxPdmVybGF5KHsgc3RhdHVzIH06IHsgc3RhdHVzOiBUaHVtYm5haWxPdmVybGF5U3RhdHVzIH0pIHtcbiAgaWYgKHN0YXR1cyA9PT0gJ2xvYWRlZCcpIHJldHVybiBudWxsO1xuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHBvc2l0aW9uPVwiYWJzb2x1dGVcIlxuICAgICAgdG9wPXswfVxuICAgICAgbGVmdD17MH1cbiAgICAgIHJpZ2h0PXswfVxuICAgICAgYm90dG9tPXswfVxuICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICBwYWRkaW5nPVwiZGVmYXVsdFwiXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I9XCJncmV5MjBcIlxuICAgID5cbiAgICAgIHtzdGF0dXMgPT09ICdsb2FkaW5nJyAmJiA8TG9hZGVyIC8+fVxuICAgICAge3N0YXR1cyA9PT0gJ2Vycm9yJyAmJiAoXG4gICAgICAgIDxUZXh0IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImVycm9yXCI+XG4gICAgICAgICAgRmFpbGVkIHRvIGxvYWRcbiAgICAgICAgPC9UZXh0PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IEltYWdlVXBsb2FkVGh1bWJuYWlsOiBSZWFjdC5GQzxJbWFnZVVwbG9hZFRodW1ibmFpbFByb3BzPiA9ICh7XG4gIHVybCxcbiAgdmFyaWFudCxcbiAgaW5kZXgsXG4gIG9uUmVtb3ZlLFxufSkgPT4ge1xuICBjb25zdCBbc3RhdHVzLCBzZXRTdGF0dXNdID0gdXNlU3RhdGU8VGh1bWJuYWlsT3ZlcmxheVN0YXR1cz4oJ2xvYWRpbmcnKTtcblxuICBjb25zdCBpbWcgPSAoXG4gICAgPGltZ1xuICAgICAgc3JjPXt1cmx9XG4gICAgICBhbHQ9XCJcIlxuICAgICAgc3R5bGU9e0lNR19TVFlMRX1cbiAgICAgIG9uTG9hZD17KCkgPT4gc2V0U3RhdHVzKCdsb2FkZWQnKX1cbiAgICAgIG9uRXJyb3I9eygpID0+IHNldFN0YXR1cygnZXJyb3InKX1cbiAgICAvPlxuICApO1xuXG4gIGNvbnN0IGltYWdlTGluayA9IChcbiAgICA8YVxuICAgICAgaHJlZj17dXJsfVxuICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgbGluZUhlaWdodDogMCB9fVxuICAgID5cbiAgICAgIHtpbWd9XG4gICAgPC9hPlxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBzdHlsZT17Q0FSRF9TVFlMRX0+XG4gICAgICA8Qm94IHBvc2l0aW9uPVwicmVsYXRpdmVcIiBzdHlsZT17SU1HX0NPTlRBSU5FUl9TVFlMRX0+XG4gICAgICAgIHtpbWFnZUxpbmt9XG4gICAgICAgIDxUaHVtYm5haWxPdmVybGF5IHN0YXR1cz17c3RhdHVzfSAvPlxuICAgICAgPC9Cb3g+XG4gICAgICB7dmFyaWFudCA9PT0gJ2VkaXQnICYmIG9uUmVtb3ZlICYmIChcbiAgICAgICAgPEJveCBwYWRkaW5nPVwic21cIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgdmFyaWFudD1cImRhbmdlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblJlbW92ZShpbmRleCl9XG4gICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUmVtb3ZlXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBGb3JtR3JvdXAsIExhYmVsLCBUZXh0LCBMb2FkZXIgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7XG4gIExBQkVMUyxcbiAgVEhVTUJfR1JJRF9TVFlMRSxcbn0gZnJvbSAnLi4vLi4vdXRpbHMvaW1hZ2UtdXBsb2FkL2ltYWdlLXVwbG9hZC1maWVsZC5jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBJbWFnZVVwbG9hZEZpZWxkU3RhdGUgfSBmcm9tICcuLi8uLi90eXBlcy9pbWFnZS11cGxvYWQtZmllbGQudHlwZXMnO1xuaW1wb3J0IHsgdXNlT2JqZWN0VXJscyB9IGZyb20gJy4uLy4uL2hvb2tzL3VzZU9iamVjdFVybHMnO1xuaW1wb3J0IHsgSW1hZ2VVcGxvYWREcm9wem9uZSB9IGZyb20gJy4vSW1hZ2VVcGxvYWREcm9wem9uZSc7XG5pbXBvcnQgeyBJbWFnZVVwbG9hZFByZXZpZXdTdHJpcCB9IGZyb20gJy4vSW1hZ2VVcGxvYWRQcmV2aWV3U3RyaXAnO1xuaW1wb3J0IHsgSW1hZ2VVcGxvYWRUaHVtYm5haWwgfSBmcm9tICcuL0ltYWdlVXBsb2FkVGh1bWJuYWlsJztcblxudHlwZSBJbWFnZVVwbG9hZEZpZWxkRWRpdFByb3BzID0gSW1hZ2VVcGxvYWRGaWVsZFN0YXRlO1xuXG5leHBvcnQgY29uc3QgSW1hZ2VVcGxvYWRGaWVsZEVkaXQ6IFJlYWN0LkZDPEltYWdlVXBsb2FkRmllbGRFZGl0UHJvcHM+ID0gKHtcbiAgZmllbGQsXG4gIHN0YXR1cyxcbiAgYWN0aW9ucyxcbn0pID0+IHtcbiAgY29uc3QgcHJldmlld1VybHMgPSB1c2VPYmplY3RVcmxzKGZpZWxkLnVwbG9hZGluZ0ZpbGVzKTtcbiAgY29uc3QgbGFiZWwgPSBmaWVsZC5pc011bHRpcGxlID8gTEFCRUxTLnBob3RvcyA6IExBQkVMUy5tYWluUGhvdG87XG4gIGNvbnN0IGRyb3B6b25lRGlzYWJsZWQgPSBzdGF0dXMudXBsb2FkaW5nIHx8ICFmaWVsZC51cGxvYWRQYXRoO1xuXG4gIHJldHVybiAoXG4gICAgPEJveD5cbiAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgIDxMYWJlbD57bGFiZWx9PC9MYWJlbD5cbiAgICAgICAge2ZpZWxkLnVwbG9hZFBhdGhQcmVmaXggJiYgIWZpZWxkLnJlY29yZElkICYmIChcbiAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBtYj1cInNtXCI+XG4gICAgICAgICAgICB7ZmllbGQuc2F2ZUZpcnN0TWVzc2FnZX1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICl9XG4gICAgICAgIDxJbWFnZVVwbG9hZERyb3B6b25lXG4gICAgICAgICAgbXVsdGlwbGU9e2ZpZWxkLmlzTXVsdGlwbGV9XG4gICAgICAgICAgZGlzYWJsZWQ9e2Ryb3B6b25lRGlzYWJsZWR9XG4gICAgICAgICAgb25Ecm9wQWNjZXB0ZWQ9eyhmaWxlcykgPT4gdm9pZCBhY3Rpb25zLmhhbmRsZUZpbGVzKGZpbGVzKX1cbiAgICAgICAgLz5cbiAgICAgICAge3N0YXR1cy51cGxvYWRpbmcgJiYgPExvYWRlciAvPn1cbiAgICAgICAge3N0YXR1cy5lcnJvciAmJiA8VGV4dCBjb2xvcj1cImVycm9yXCI+e3N0YXR1cy5lcnJvcn08L1RleHQ+fVxuICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgIDxJbWFnZVVwbG9hZFByZXZpZXdTdHJpcCBwcmV2aWV3VXJscz17cHJldmlld1VybHN9IC8+XG5cbiAgICAgIHtmaWVsZC51cmxzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8Qm94IG10PVwiZGVmYXVsdFwiIHN0eWxlPXtUSFVNQl9HUklEX1NUWUxFfT5cbiAgICAgICAgICB7ZmllbGQudXJscy5tYXAoKHVybCwgaSkgPT4gKFxuICAgICAgICAgICAgPEltYWdlVXBsb2FkVGh1bWJuYWlsXG4gICAgICAgICAgICAgIGtleT17dXJsfVxuICAgICAgICAgICAgICB1cmw9e3VybH1cbiAgICAgICAgICAgICAgdmFyaWFudD1cImVkaXRcIlxuICAgICAgICAgICAgICBpbmRleD17aX1cbiAgICAgICAgICAgICAgb25SZW1vdmU9e2FjdGlvbnMucmVtb3ZlVXJsfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApO1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IFRIVU1CX0dSSURfU1RZTEUgfSBmcm9tICcuLi8uLi91dGlscy9pbWFnZS11cGxvYWQvaW1hZ2UtdXBsb2FkLWZpZWxkLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBJbWFnZVVwbG9hZFRodW1ibmFpbCB9IGZyb20gJy4vSW1hZ2VVcGxvYWRUaHVtYm5haWwnO1xuXG50eXBlIEltYWdlVXBsb2FkRmllbGRTaG93UHJvcHMgPSB7XG4gIHVybHM6IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IGNvbnN0IEltYWdlVXBsb2FkRmllbGRTaG93OiBSZWFjdC5GQzxJbWFnZVVwbG9hZEZpZWxkU2hvd1Byb3BzPiA9ICh7XG4gIHVybHMsXG59KSA9PiB7XG4gIGlmICh1cmxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHN0eWxlPXtUSFVNQl9HUklEX1NUWUxFfT5cbiAgICAgIHt1cmxzLm1hcCgodXJsLCBpKSA9PiAoXG4gICAgICAgIDxJbWFnZVVwbG9hZFRodW1ibmFpbCBrZXk9e3VybH0gdXJsPXt1cmx9IHZhcmlhbnQ9XCJzaG93XCIgaW5kZXg9e2l9IC8+XG4gICAgICApKX1cbiAgICA8L0JveD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSW1hZ2VVcGxvYWRGaWVsZCB9IGZyb20gJy4uLy4uL2hvb2tzL3VzZUltYWdlVXBsb2FkRmllbGQnO1xuaW1wb3J0IHR5cGUgeyBJbWFnZVVwbG9hZEZpZWxkUHJvcHMgfSBmcm9tICcuLi8uLi90eXBlcy9pbWFnZS11cGxvYWQtZmllbGQudHlwZXMnO1xuaW1wb3J0IHsgSW1hZ2VVcGxvYWRGaWVsZEVkaXQgfSBmcm9tICcuL0ltYWdlVXBsb2FkRmllbGRFZGl0JztcbmltcG9ydCB7IEltYWdlVXBsb2FkRmllbGRTaG93IH0gZnJvbSAnLi9JbWFnZVVwbG9hZEZpZWxkU2hvdyc7XG5cbmV4cG9ydCBjb25zdCBJbWFnZVVwbG9hZEZpZWxkOiBSZWFjdC5GQzxJbWFnZVVwbG9hZEZpZWxkUHJvcHM+ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgd2hlcmUgfSA9IHByb3BzO1xuICBjb25zdCBzdGF0ZSA9IHVzZUltYWdlVXBsb2FkRmllbGQocHJvcHMpO1xuXG4gIGlmICh3aGVyZSA9PT0gJ2VkaXQnKSB7XG4gICAgcmV0dXJuIDxJbWFnZVVwbG9hZEZpZWxkRWRpdCB7Li4uc3RhdGV9IC8+O1xuICB9XG5cbiAgaWYgKHdoZXJlID09PSAnc2hvdycgfHwgd2hlcmUgPT09ICdsaXN0Jykge1xuICAgIHJldHVybiA8SW1hZ2VVcGxvYWRGaWVsZFNob3cgdXJscz17c3RhdGUuZmllbGQudXJsc30gLz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEltYWdlVXBsb2FkRmllbGQ7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBMaW5rc0ZpZWxkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xpbmtzRmllbGQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxpbmtzRmllbGQgPSBMaW5rc0ZpZWxkXG5pbXBvcnQgSW1hZ2VVcGxvYWRGaWVsZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9JbWFnZVVwbG9hZC9JbWFnZVVwbG9hZEZpZWxkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5JbWFnZVVwbG9hZEZpZWxkID0gSW1hZ2VVcGxvYWRGaWVsZCJdLCJuYW1lcyI6WyJMSU5LX0tFWVMiLCJMQUJFTFMiLCJmYWNlYm9vayIsImluc3RhZ3JhbSIsImFpcmJuYiIsImJvb2tpbmciLCJwYXJzZUxpbmtzIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJvYmoiLCJyZWR1Y2UiLCJhY2MiLCJrZXkiLCJ2IiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwiZ2V0TGlua3NGcm9tUGFyYW1zIiwicGFyYW1zIiwicGF0aCIsIm5lc3RlZCIsInByZWZpeCIsInVzZUxpbmtzRmllbGQiLCJwcm9wcyIsInByb3BlcnR5IiwicmVjb3JkIiwib25DaGFuZ2UiLCJsaW5rcyIsImhhbmRsZUNoYW5nZSIsIkxpbmtJdGVtRWRpdCIsImxpbmtLZXkiLCJpZCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkZvcm1Hcm91cCIsIm1iIiwiTGFiZWwiLCJodG1sRm9yIiwiSW5wdXQiLCJlIiwidGFyZ2V0IiwicGxhY2Vob2xkZXIiLCJMaW5rSXRlbVNob3ciLCJCb3giLCJtdCIsImhyZWYiLCJyZWwiLCJMaW5rc0ZpZWxkIiwid2hlcmUiLCJtYXAiLCJmaWxsZWQiLCJmaWx0ZXIiLCJrIiwibGVuZ3RoIiwiQlVDS0VUIiwibWFpblBob3RvIiwicGhvdG9zIiwiVVBMT0FEX1VSTCIsIkRFRkFVTFRfU0FWRV9GSVJTVF9NRVNTQUdFIiwiVVBMT0FEX0VSUk9SX0ZBTExCQUNLIiwiSU1BR0VfQUNDRVBUX01BUCIsIlRIVU1CX1NJWkUiLCJUSFVNQl9HUklEX1NUWUxFIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJVUExPQURJTkdfUFJFVklFV19TVFlMRSIsIm1heEhlaWdodCIsIm9iamVjdEZpdCIsImdldFVybHNGcm9tUGFyYW1zIiwiaXNNdWx0aXBsZSIsImdldEFycmF5RnJvbVBhcmFtcyIsImdldFJlY29yZElkIiwidW5kZWZpbmVkIiwiZW5zdXJlU3RyaW5nQXJyYXkiLCJkaXJlY3QiLCJjb2xsZWN0ZWQiLCJpIiwicHVzaCIsImJ1aWxkVXBsb2FkUGF0aCIsInVwbG9hZFBhdGhQcmVmaXgiLCJyZWNvcmRJZCIsInNlZ21lbnQiLCJ0cmltIiwicmVwbGFjZSIsImdldEVycm9yTWVzc2FnZSIsImVyciIsImZhbGxiYWNrIiwiRXJyb3IiLCJtZXNzYWdlIiwidXBsb2FkRmlsZSIsImZpbGUiLCJ1cGxvYWRQYXRoIiwidXJsIiwiVVJMIiwid2luZG93IiwibG9jYXRpb24iLCJvcmlnaW4iLCJzZWFyY2hQYXJhbXMiLCJzZXQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwicmVzIiwiZmV0Y2giLCJ0b1N0cmluZyIsIm1ldGhvZCIsImJvZHkiLCJjcmVkZW50aWFscyIsIm9rIiwianNvbiIsImNhdGNoIiwic3RhdHVzVGV4dCIsImRhdGEiLCJnZXRTdG9yYWdlS2V5RnJvbVB1YmxpY1VybCIsInBhdGhuYW1lIiwic3RhcnRzV2l0aCIsInNsaWNlIiwiZGVsZXRlRmlsZUJ5VXJsIiwiZGVsZXRlVXJsIiwidXBsb2FkRmlsZXNBbmRCdWlsZE5leHRWYWx1ZSIsImZpbGVzIiwiY3VycmVudFVybHMiLCJsaXN0IiwiZnJvbSIsInVybHMiLCJnZXRGaWVsZENvbmZpZyIsImN1c3RvbSIsInNhdmVGaXJzdE1lc3NhZ2UiLCJ1c2VJbWFnZVVwbG9hZEZpZWxkIiwiY29uZmlnIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwidXNlU3RhdGUiLCJlcnJvciIsInNldEVycm9yIiwidXBsb2FkaW5nRmlsZXMiLCJzZXRVcGxvYWRpbmdGaWxlcyIsImhhbmRsZUZpbGVzIiwibmV4dFZhbHVlIiwicmVtb3ZlVXJsIiwiaW5kZXgiLCJ1cmxUb1JlbW92ZSIsIm5leHQiLCJfIiwiZmllbGQiLCJzdGF0dXMiLCJhY3Rpb25zIiwidXNlT2JqZWN0VXJscyIsInNldFVybHMiLCJ1c2VFZmZlY3QiLCJmIiwiY3JlYXRlT2JqZWN0VVJMIiwiZm9yRWFjaCIsInJldm9rZU9iamVjdFVSTCIsImV4cG9ydHMiLCJ0aGlzIiwicmVxdWlyZSQkMCIsIl90b0NvbnN1bWFibGVBcnJheSIsIl9hcnJheVdpdGhvdXRIb2xlcyIsIl9pdGVyYWJsZVRvQXJyYXkiLCJfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkiLCJfbm9uSXRlcmFibGVTcHJlYWQiLCJfYXJyYXlMaWtlVG9BcnJheSIsIm93bktleXMiLCJfb2JqZWN0U3ByZWFkIiwiX2RlZmluZVByb3BlcnR5IiwiX3NsaWNlZFRvQXJyYXkiLCJfYXJyYXlXaXRoSG9sZXMiLCJfaXRlcmFibGVUb0FycmF5TGltaXQiLCJfbm9uSXRlcmFibGVSZXN0IiwiZm9yd2FyZFJlZiIsInVzZUltcGVyYXRpdmVIYW5kbGUiLCJGcmFnbWVudCIsImZyb21FdmVudCIsIlByb3BUeXBlcyIsInVzZU1lbW8iLCJ1c2VSZWYiLCJ1c2VSZWR1Y2VyIiwidXNlQ2FsbGJhY2siLCJJbWFnZVVwbG9hZERyb3B6b25lIiwibXVsdGlwbGUiLCJkaXNhYmxlZCIsIm9uRHJvcEFjY2VwdGVkIiwiZ2V0Um9vdFByb3BzIiwiZ2V0SW5wdXRQcm9wcyIsImlzRHJhZ0FjdGl2ZSIsInVzZURyb3B6b25lIiwiYWNjZXB0IiwiYWNjZXB0ZWRGaWxlcyIsIm5vQ2xpY2siLCJub0tleWJvYXJkIiwiaGludCIsIl9leHRlbmRzIiwicGFkZGluZyIsImJvcmRlciIsImJvcmRlclJhZGl1cyIsImJhY2tncm91bmRDb2xvciIsInN0eWxlIiwiY3Vyc29yIiwiYm9yZGVyU3R5bGUiLCJtYXJnaW5Cb3R0b20iLCJUZXh0IiwiZm9udFNpemUiLCJjb2xvciIsIkltYWdlVXBsb2FkUHJldmlld1N0cmlwIiwicHJldmlld1VybHMiLCJmbGV4V3JhcCIsInBvc2l0aW9uIiwiYWxpZ25JdGVtcyIsInNyYyIsImFsdCIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsImp1c3RpZnlDb250ZW50IiwiTG9hZGVyIiwiQ0FSRF9TVFlMRSIsIndpZHRoIiwib3ZlcmZsb3ciLCJJTUdfQ09OVEFJTkVSX1NUWUxFIiwiaGVpZ2h0IiwiSU1HX1NUWUxFIiwiVGh1bWJuYWlsT3ZlcmxheSIsIkltYWdlVXBsb2FkVGh1bWJuYWlsIiwidmFyaWFudCIsIm9uUmVtb3ZlIiwic2V0U3RhdHVzIiwiaW1nIiwib25Mb2FkIiwib25FcnJvciIsImltYWdlTGluayIsImxpbmVIZWlnaHQiLCJCdXR0b24iLCJzaXplIiwib25DbGljayIsIkltYWdlVXBsb2FkRmllbGRFZGl0IiwibGFiZWwiLCJkcm9wem9uZURpc2FibGVkIiwiSW1hZ2VVcGxvYWRGaWVsZFNob3ciLCJJbWFnZVVwbG9hZEZpZWxkIiwic3RhdGUiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0VBQU8sTUFBTUEsU0FBUyxHQUFHLENBQ3ZCLFVBQVUsRUFDVixXQUFXLEVBQ1gsUUFBUSxFQUNSLFNBQVMsQ0FDRDs7RUNGSCxNQUFNQyxRQUErQixHQUFHO0VBQzdDQyxFQUFBQSxRQUFRLEVBQUUsVUFBVTtFQUNwQkMsRUFBQUEsU0FBUyxFQUFFLFdBQVc7RUFDdEJDLEVBQUFBLE1BQU0sRUFBRSxRQUFRO0VBQ2hCQyxFQUFBQSxPQUFPLEVBQUU7RUFDWCxDQUFDO0VBRU0sU0FBU0MsVUFBVUEsQ0FBQ0MsS0FBYyxFQUFjO0VBQ3JELEVBQUEsSUFBSUEsS0FBSyxJQUFJLElBQUksRUFBRSxPQUFPLEVBQUU7RUFDNUIsRUFBQSxJQUFJLE9BQU9BLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLENBQUNGLEtBQUssQ0FBQyxFQUFFO01BQ3RELE1BQU1HLEdBQUcsR0FBR0gsS0FBZ0M7TUFDNUMsT0FBT1AsU0FBUyxDQUFDVyxNQUFNLENBQWEsQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEtBQUs7RUFDaEQsTUFBQSxNQUFN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VyxLQUFLLFVBQVUsT0FBTyxFQUFFLElBQUksRUFBRTtFQUN6RSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLFFBQVEsR0FBRyxNQUFNLEVBQUUsU0FBUyxDQUFDO0VBQ3BNLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUEsQ0FBRSxDQUFDLEVBQUUsQ0FBQztFQUMvSixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBRSxDQUFDLENBQUE7RUFDcEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7RUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDO0VBQ3JFLFFBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7RUFDdEQsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7RUFDeEssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUNuRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7RUFDeEMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7RUFDdkUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FB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QUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFNLEtBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFNLEtBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQzs7OztFQ0FweUMsU0FBU0csb0JBQWtCLENBQUMsR0FB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QVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsSUFBSSwwQ0FBMEMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzs7RUFFL1osU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7O0VBRXRMLFNBQVMscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7O0VBRWhnQixTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQzs7RUFFcEUsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxFQUFFLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0s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Q0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUEsSUFBSSxZQUFZLEdBQUc7RUFDbkIsRUFBRSxTQUFTLEVBQUUsS0FBSztFQUNsQixFQUFFLGtCQUFrQixFQUFFLEtBQUs7RUFDM0IsRUFBRSxZQUFZLEVBQUUsS0FBSztFQUNyQixFQUFFLFlBQVksRUFBRSxLQUFLO0VBQ3JCLEVBQUUsWUFBWSxFQUFFLEtBQUs7RUFDckIsRUFBRSxZQUFZLEVBQUUsS0FBSztFQUNyQixFQUFFLGFBQWEsRUFBRSxFQUFFO0VBQ25CLEVBQUUsY0FBYyxFQUFFO0VBQ2xCLENBQUM7RUFDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7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
