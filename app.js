const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));

// SYSREG: V3_ENDPOINT_MAP
const QUERY_PATH = '/v3/internal/api/query';
const HYDRATE_PATH = '/api/v1/hydrate';
const VAULT_PATH = '/api/v1/vault/open';

// TODO: @Watson - check entropy on reversed hex for sync hint
const originalHint = 'eyJleHBlcmltZW50YWxfZmVhdHVyZSI6ICJDbGllbnRTaWRlSHlkcmF0aW9uIiwgImRlYnVnX2tleSI6ICJQUk9UT1RZUEVfU1lOQ19FTkFCTEVUIn0=';
const hintHex = Buffer.from(originalHint).toString('hex');
const hardenedHint = hintHex.split('').reverse().join('');

// SYSMIG: LGC_COORD_PORT
app.get('/v3/internal/notes.txt', (req, res) => {
  res.send(`**SYSTEM MIGRATION LOG - OMEGA SECTOR**

* [DONE] Ported legacy coordinates to GraphQL.
* [DONE] Disabled introspection on primary engine.
* [NOTE] Developers: Field definitions and naming conventions are stored in the hidden /v3/internal/archive/ directory. 
* [WARN] Unauthorized access to the archive will be logged.
* [AUTH] Required header: X-Watson-Auth: WATSON_PRIME_2026`);
});

// ARCH_IDX: RECON_PTR
app.get('/v3/internal/archive/', (req, res) => {
  res.send(`<h1>Index of /v3/internal/archive/</h1><hr><pre>
<a href="../">../</a>
<a href="naming_convention.json">naming_convention.json</a>    2026-03-27 14:12  245
<a href="legal_disclaimer.txt">legal_disclaimer.txt</a>      2024-01-01 09:00  1240
<a href="meeting_notes_2024.pdf">meeting_notes_2024.pdf</a>    2024-05-12 11:45  45210
<a href="old_logo_backup.zip">old_logo_backup.zip</a>        2023-11-20 16:30  8942
</pre><hr>`);
});

// ARCH_DAT: NAMING_STD
app.get('/v3/internal/archive/naming_convention.json', (req, res) => {
  res.json({
    "project": "Watson-Omega",
    "naming_standard": {
      "geo_data": "prefix_sector_logs",
      "prefix_current": "alpha",
      "prefix_legacy": "theta"
    },
    "deployment_zone": "Sector-7",
    "storage_format": "reverse_stream_v2",
    "encoding": "hex_base64"
  });
});

app.get('/v3/internal/archive/legal_disclaimer.txt', (req, res) => res.send("LEGAL DISCLAIMER: All data in this sector is property of Watson Industries..."));
app.get('/v3/internal/archive/meeting_notes_2024.pdf', (req, res) => res.status(200).send("%PDF-1.4 [Empty PDF Data]"));
app.get('/v3/internal/archive/old_logo_backup.zip', (req, res) => res.status(200).send("PK\x03\x04 [Corrupted Zip Data]"));

// GQL_SCH: ALPHA_THETA_MAPPING
const schema = buildSchema(`
  type SystemMaintenance {
    status: String
    logs: String
  }

  type SystemCore {
    maintenance: SystemMaintenance
  }

  type Query {
    alpha_sector_logs(id: ID!): SystemCore
    theta_sector_logs(id: ID!): SystemCore
  }
`);

const root = {
  alpha_sector_logs: () => {
    return {
      maintenance: {
        status: "DEGRADED",
        logs: hardenedHint
      }
    };
  },
  theta_sector_logs: () => {
    throw new Error("DATA_PURGED: theta_sector_logs is deprecated. Movement to Alpha sector is required for synchronization.");
  }
};

// DECOY: NOISE_INJECTION
app.get(['/v1', '/v2'], (req, res) => res.status(301).send("<html><body>Redirecting to Legacy_API_Archive_v1... <strong>ERROR: REDIRECT_LOOP_DETECTED</strong></body></html>"));
app.get('/test-env', (req, res) => res.status(200).json({ 
  status: "ONLINE", 
  version: "0.0.1-alpha", 
  dummy_records: [
    { id: 101, type: "SENSOR_TEST", val: 42.1 },
    { id: 102, type: "TEMP_TEST", val: 19.5 }
  ]
}));
app.get('/dev', (req, res) => res.status(200).send("n0t__s0__f4st__intrud3r__#@!"));
app.get(['/staging'], (req, res) => res.status(403).json({ status: "restricted", message: "Developer credentials required." }));
app.get(['/assets', '/logs', '/backup'], (req, res) => res.status(404).send("Error: File system integrity failed. Resource not found."));
app.get(['/v3/old', '/v3/backup'], (req, res) => res.status(403).json({ status: "error", message: "Sector 3 archive access denied." }));
app.get(['/v3/staging', '/v3/test'], (req, res) => res.status(403).json({ status: "unauthorized", message: "Production environment only." }));
app.get('/v3/internal/db', (req, res) => res.status(200).json({
  db_type: "SQLITE_MOCK",
  users: ["admin_test", "dev_guest"],
  active: false
}));
app.get('/v3/internal/auth', (req, res) => res.status(200).send("[AUTH_LOG]: Failed login attempt from 192.168.1.50 at " + new Date().toISOString()));
app.get('/v3/internal/config', (req, res) => res.status(200).send("<?xml version='1.0'?><root><setting name='debug'>false</setting><setting name='maintenance'>true</setting></root>"));
app.get(['/v3/internal/api/v1', '/v3/internal/api/test', '/v3/internal/api/v2'], (req, res) => res.status(403).json({ status: "invalid_version", message: "API version misaligned." }));
app.get('/v3/internal/api/debug', (req, res) => res.status(200).json({
  debug_status: "DISABLED",
  stack_trace: "None available in production build."
}));

// TRAIL: 403_NESTED_PTR
app.get('/v3', (req, res) => res.status(403).json({ error: "Access Denied: Sector 3 restricted." }));
app.get('/v3/internal', (req, res) => res.status(403).json({ error: "Access Denied: Internal network only." }));
app.get('/v3/internal/api', (req, res) => res.status(403).json({ error: "Access Denied: API access requires token." }));

// SEC: HDR_VAL_CHECK_PRIME
app.use(QUERY_PATH, (req, res, next) => {
  const authHeader = req.headers['x-watson-auth'];
  if (authHeader !== 'WATSON_PRIME_2026') {
    return res.status(401).json({
      error: "UNAUTHORIZED_ACCESS",
      message: "Required X-Watson-Auth header missing or invalid for primary engine."
    });
  }
  next();
}, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: false, 
}));

// REG: KERNEL_HYDRATION_PP
app.post(HYDRATE_PATH, express.text({ type: 'application/json' }), (req, res) => {
  try {
    const bodyStr = req.body;
    const safeBody = bodyStr.replace(/"__proto__"/g, '"PROTOPYTE_SYNC"')
      .replace(/"constructor"/g, '"CONSTRUCTOR_SYNC"');
    const data = JSON.parse(safeBody);

    if (data.PROTOPYTE_SYNC) {
      Object.assign(Object.prototype, data.PROTOPYTE_SYNC);
    }
    
    _.merge(Object.prototype, data);

    res.json({ status: "success", message: "Kernel hydration sequence initiated." });
  } catch (e) {
    res.status(400).json({ status: "error", message: "Malformed packet." });
  }
});

// VAL: OMEGA_7_GATE
app.get(VAULT_PATH, (req, res) => {
  const quotes = [
    "You see, but you do not observe.",
    "It is a capital mistake to theorize before one has data.",
    "The world is full of obvious things which nobody by any chance ever observes.",
    "Exposed? You involve me in a matter of which I have no knowledge."
  ];

  if (({}).clearance === "OMEGA_7") {
    try {
      let flagPath = '/flag.txt';
      if (!fs.existsSync(flagPath)) {
        flagPath = path.join(__dirname, 'flag.txt');
      }
      const flag = fs.readFileSync(flagPath, 'utf8').trim();
      res.json({ status: "success", flag: flag });
    } catch (err) {
      res.status(500).json({ status: "error", message: "Vault integrity failure." });
    }
  } else {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(403).json({ status: "error", message: `ACCESS DENIED: ${randomQuote}` });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`[SYSTEM] The Watson Protocol online on port ${PORT}`);
  console.log(`[SYSTEM] Internal Query: ${QUERY_PATH}`);
});

if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    console.log('[SYSTEM] Production cleanup triggered; exiting for clean restart.');
    process.exit(0);
  }, 300000);
}
