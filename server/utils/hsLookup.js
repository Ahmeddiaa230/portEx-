/**
 * Shared HS Code lookup utility.
 * Used by routes/calculate.js and routes/hs.js.
 * No duplicated logic between files.
 */

const localHsTable = [
  { prefix: '01', category: 'Food',        minDuty: 5,  maxDuty: 25  },
  { prefix: '24', category: 'Food',        minDuty: 5,  maxDuty: 25  },
  { prefix: '28', category: 'Chemicals',   minDuty: 2,  maxDuty: 6.5 },
  { prefix: '38', category: 'Chemicals',   minDuty: 2,  maxDuty: 6.5 },
  { prefix: '39', category: 'Plastics',    minDuty: 4,  maxDuty: 12  },
  { prefix: '40', category: 'Plastics',    minDuty: 4,  maxDuty: 12  },
  { prefix: '48', category: 'Paper',       minDuty: 0,  maxDuty: 5   },
  { prefix: '49', category: 'Paper',       minDuty: 0,  maxDuty: 5   },
  { prefix: '50', category: 'Textiles',    minDuty: 8,  maxDuty: 20  },
  { prefix: '63', category: 'Textiles',    minDuty: 8,  maxDuty: 20  },
  { prefix: '72', category: 'Steel/Metal', minDuty: 3,  maxDuty: 10  },
  { prefix: '73', category: 'Steel/Metal', minDuty: 3,  maxDuty: 10  },
  { prefix: '84', category: 'Machinery',   minDuty: 0,  maxDuty: 5   },
  { prefix: '85', category: 'Electronics', minDuty: 0,  maxDuty: 3.5 },
  { prefix: '87', category: 'Vehicles',    minDuty: 5,  maxDuty: 25  },
  { prefix: '94', category: 'Furniture',   minDuty: 5,  maxDuty: 15  }
];

/**
 * Look up duty rate for a given HS code string.
 * @param {string} hsCode - e.g. "7318.15" or "731815"
 * @returns {{ found: boolean, category: string|null, dutyRate: number, note: string|null }}
 */
function lookupHsCode(hsCode) {
  const codeStr = hsCode.replace('.', '').substring(0, 2);
  const codeInt = parseInt(codeStr, 10);

  const match = localHsTable.find(t => {
    if (t.prefix === codeStr) return true;
    if (t.category === 'Food'        && codeInt >= 1  && codeInt <= 24) return true;
    if (t.category === 'Chemicals'   && codeInt >= 28 && codeInt <= 38) return true;
    if (t.category === 'Plastics'    && codeInt >= 39 && codeInt <= 40) return true;
    if (t.category === 'Paper'       && codeInt >= 48 && codeInt <= 49) return true;
    if (t.category === 'Textiles'    && codeInt >= 50 && codeInt <= 63) return true;
    if (t.category === 'Steel/Metal' && codeInt >= 72 && codeInt <= 73) return true;
    return false;
  });

  if (match) {
    return { found: true, category: match.category, dutyRate: match.maxDuty, note: null };
  }
  return { found: false, category: null, dutyRate: 5, note: 'Default rate applied' };
}

module.exports = { lookupHsCode };
