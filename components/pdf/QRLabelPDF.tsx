'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { formatExpiry } from '@/lib/qr'

interface QRLabelData {
  machineName: string
  fileName: string
  qrUniqueId: string
  expiryDate: string | null
  generatedDate: string
  status: 'pass' | 'fail' | 'needs_attention'
  companyName?: string
  uploaderName?: string
  nextInspectionDate?: string
  qrDataUrl?: string
}

interface QRLabelPDFProps {
  labels: QRLabelData[]
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  label: {
    border: '2pt solid #e5e5e5',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
    pageBreakInside: 'avoid',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  machineName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#07080f',
    marginBottom: 4,
  },
  fileName: {
    fontSize: 11,
    color: '#5e5c80',
    fontFamily: 'Helvetica',
  },
  statusBadge: {
    padding: '4 12',
    borderRadius: 4,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  statusPass: { backgroundColor: '#e8fff5', color: '#00c06a' },
  statusFail: { backgroundColor: '#fff0f0', color: '#cc0000' },
  statusNeeds: { backgroundColor: '#fff8e8', color: '#c07800' },
  divider: {
    borderBottom: '1pt solid #f0f0f0',
    marginBottom: 16,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    width: '48%',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 8,
    color: '#9896b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
    fontFamily: 'Helvetica-Bold',
  },
  metaValue: {
    fontSize: 11,
    color: '#07080f',
    fontFamily: 'Helvetica',
  },
  qrId: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#6c63ff',
    letterSpacing: 2,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1pt solid #f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9896b8',
  },
})

function getStatusStyle(status: string) {
  if (status === 'pass') return styles.statusPass
  if (status === 'fail') return styles.statusFail
  return styles.statusNeeds
}

function getStatusLabel(status: string) {
  if (status === 'pass') return 'PASS'
  if (status === 'fail') return 'FAIL'
  return 'NEEDS ATTENTION'
}

export function QRLabelPDF({ labels }: QRLabelPDFProps) {
  return (
    <Document>
      {labels.map((label, i) => (
        <Page key={i} size="A4" style={styles.page}>
          <View style={styles.label}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.machineName}>{label.machineName}</Text>
                <Text style={styles.fileName}>{label.fileName}</Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(label.status)]}>
                <Text>{getStatusLabel(label.status)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* QR ID */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.metaLabel}>QR Code ID</Text>
              <Text style={styles.qrId}>{label.qrUniqueId}</Text>
            </View>

            {/* Meta grid */}
            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Generated</Text>
                <Text style={styles.metaValue}>
                  {new Date(label.generatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Expires</Text>
                <Text style={styles.metaValue}>{formatExpiry(label.expiryDate)}</Text>
              </View>
              {label.companyName && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Company</Text>
                  <Text style={styles.metaValue}>{label.companyName}</Text>
                </View>
              )}
              {label.uploaderName && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Inspector</Text>
                  <Text style={styles.metaValue}>{label.uploaderName}</Text>
                </View>
              )}
              {label.nextInspectionDate && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Next Inspection</Text>
                  <Text style={styles.metaValue}>
                    {new Date(label.nextInspectionDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Project QR — Industrial Asset Management</Text>
              <Text style={styles.footerText}>Scan QR code to view file</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
}
