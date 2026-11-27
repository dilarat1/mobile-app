import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { storageService } from '../services/storageService';
import GinghamHeader from '../components/GinghamHeader';

export default function AuthScreen({ onAuthSuccess }) {
  // 'login' | 'register' | 'forgot' | 'google'
  const [mode, setMode] = useState('login');
  // 'email' | 'phone'
  const [method, setMethod] = useState('email');

  // Form alanları
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Şifremi Unuttum alanları
  const [forgotStep, setForgotStep] = useState(1); // 1: mail/tel gir, 2: kod + yeni şifre
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Google ile bağlan alanları
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // Geri bildirim mesajları
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateIdentifier = (val) => {
    const trimmed = val.trim();
    if (method === 'email') {
      if (!trimmed.includes('@') || !trimmed.includes('.')) {
        return 'Lütfen geçerli bir e-posta adresi gir (örn: ad@mail.com).';
      }
    } else {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 10) {
        return 'Lütfen geçerli bir telefon numarası gir (en az 10 hane).';
      }
    }
    return null;
  };

  // Giriş Yap
  const handleLogin = async () => {
    clearMessages();
    const idErr = validateIdentifier(identifier);
    if (idErr) {
      setErrorMsg(idErr);
      return;
    }
    if (!password) {
      setErrorMsg('Lütfen şifreni gir.');
      return;
    }

    const res = await storageService.loginUser({ identifier, password });
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }
    onAuthSuccess(res.user);
  };

  // Kayıt Ol
  const handleRegister = async () => {
    clearMessages();
    if (fullName.trim().length < 2) {
      setErrorMsg('Lütfen ad ve soyadını gir.');
      return;
    }
    const idErr = validateIdentifier(identifier);
    if (idErr) {
      setErrorMsg(idErr);
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Şifren en az 6 karakter olmalı.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Girdiğin şifreler birbiriyle eşleşmiyor.');
      return;
    }

    const res = await storageService.registerUser({
      fullName,
      method,
      identifier,
      password,
    });
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }
    onAuthSuccess(res.user);
  };

  // Şifremi Unuttum - 1. Adım: Kod Gönder
  const handleSendResetCode = async () => {
    clearMessages();
    if (!identifier.trim()) {
      setErrorMsg('Lütfen kayıtlı e-posta veya telefon numaranı gir.');
      return;
    }
    const users = await storageService.getRegisteredUsers();
    const found = users.find(
      (u) => u.identifier.toLowerCase() === identifier.trim().toLowerCase()
    );
    if (!found) {
      setErrorMsg('Bu bilgiyle kayıtlı bir hesap bulunamadı.');
      return;
    }
    if (found.method === 'google') {
      setErrorMsg('Bu hesap Google ile bağlı. Şifre sıfırlamak yerine Google ile bağlanabilirsin.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setForgotStep(2);
    setSuccessMsg(`Doğrulama kodu gönderildi! (Test Kodu: ${code})`);
  };

  // Şifremi Unuttum - 2. Adım: Şifreyi Güncelle
  const handleConfirmReset = async () => {
    clearMessages();
    if (verificationCode.trim() !== sentCode) {
      setErrorMsg('Doğrulama kodu hatalı.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Yeni şifren en az 6 karakter olmalı.');
      return;
    }
    const res = await storageService.resetPassword({
      identifier,
      newPassword,
    });
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }
    setSuccessMsg('Şifren başarıyla güncellendi! Şimdi yeni şifrenle giriş yapabilirsin.');
    setPassword('');
    setNewPassword('');
    setVerificationCode('');
    setForgotStep(1);
    setMode('login');
  };

  // Google ile Bağlan
  const handleGoogleConnect = async () => {
    clearMessages();
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir Google e-posta adresi gir (örn: ad@gmail.com).');
      return;
    }
    const res = await storageService.loginWithGoogle({
      email: googleEmail,
      fullName: googleName,
    });
    if (res.ok) {
      onAuthSuccess(res.user);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <GinghamHeader
        title="TimeCapsule"
        subtitle="✨ Anılarını Kilitle • Sadece Üyelere Özel ✨"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authCard}>
          {/* Üst Washi Bant */}
          <View style={styles.topTape} />

          {/* Mod Seçimi (Giriş Yap / Kayıt Ol) */}
          {(mode === 'login' || mode === 'register') && (
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
                onPress={() => {
                  setMode('login');
                  clearMessages();
                }}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    mode === 'login' && styles.modeTabTextActive,
                  ]}
                >
                  Giriş Yap
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, mode === 'register' && styles.modeTabActive]}
                onPress={() => {
                  setMode('register');
                  clearMessages();
                }}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    mode === 'register' && styles.modeTabTextActive,
                  ]}
                >
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Hata veya Başarı Mesajı */}
          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {successMsg ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>✨ {successMsg}</Text>
            </View>
          ) : null}

          {/* ================= 1. GİRİŞ YAP & KAYIT OL FORMU ================= */}
          {(mode === 'login' || mode === 'register') && (
            <View>
              {/* Yöntem Seçimi: E-posta vs Telefon No */}
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[
                    styles.methodPill,
                    method === 'email' && styles.methodPillActive,
                  ]}
                  onPress={() => {
                    setMethod('email');
                    setIdentifier('');
                    clearMessages();
                  }}
                >
                  <Text
                    style={[
                      styles.methodText,
                      method === 'email' && styles.methodTextActive,
                    ]}
                  >
                    ✉️ E-posta ile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodPill,
                    method === 'phone' && styles.methodPillActive,
                  ]}
                  onPress={() => {
                    setMethod('phone');
                    setIdentifier('');
                    clearMessages();
                  }}
                >
                  <Text
                    style={[
                      styles.methodText,
                      method === 'phone' && styles.methodTextActive,
                    ]}
                  >
                    📱 Telefon No ile
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Ad Soyad (Sadece Kayıt Olurken) */}
              {mode === 'register' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Ad Soyad *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Örn: Dilara Toraman"
                    placeholderTextColor="#998"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              )}

              {/* E-posta veya Telefon Girişi */}
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>
                  {method === 'email' ? 'E-posta Adresi *' : 'Telefon Numarası *'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={
                    method === 'email' ? 'ornek@mail.com' : '05XX XXX XX XX'
                  }
                  placeholderTextColor="#998"
                  keyboardType={
                    method === 'email' ? 'email-address' : 'phone-pad'
                  }
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={setIdentifier}
                />
              </View>

              {/* Şifre */}
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Şifre *</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="En az 6 karakter"
                    placeholderTextColor="#998"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Şifre Tekrar (Sadece Kayıt Olurken) */}
              {mode === 'register' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Şifre Tekrar *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Şifreni tekrar yaz"
                    placeholderTextColor="#998"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              )}

              {/* Şifremi Unuttum Linki (Sadece Giriş Modunda) */}
              {mode === 'login' && (
                <TouchableOpacity
                  style={styles.forgotLink}
                  onPress={() => {
                    setMode('forgot');
                    setForgotStep(1);
                    clearMessages();
                  }}
                >
                  <Text style={styles.forgotLinkText}>Şifremi Unuttum?</Text>
                </TouchableOpacity>
              )}

              {/* Ana Buton */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={mode === 'login' ? handleLogin : handleRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {mode === 'login' ? 'Giriş Yap 🎀' : 'Hesap Oluştur ✨'}
                </Text>
              </TouchableOpacity>

              {/* Ayırıcı */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google ile Bağlan Butonu */}
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => {
                  setMode('google');
                  clearMessages();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.googleBadge}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>Google Hesabıyla Bağlan</Text>
              </TouchableOpacity>

              {/* Alt Yönlendirme */}
              <TouchableOpacity
                style={styles.switchPrompt}
                onPress={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  clearMessages();
                }}
              >
                <Text style={styles.switchPromptText}>
                  {mode === 'login'
                    ? 'Henüz hesabın yok mu? Kayıt Ol →'
                    : 'Zaten hesabın var mı? Giriş Yap →'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================= 2. ŞİFREMİ UNUTTUM EKRANI ================= */}
          {mode === 'forgot' && (
            <View>
              <Text style={styles.subCardTitle}>🔑 Şifremi Sıfırla</Text>
              <Text style={styles.subCardDesc}>
                {forgotStep === 1
                  ? 'Kayıtlı e-posta adresini veya telefon numaranı gir, sana doğrulama kodu gönderelim.'
                  : 'Gelen 6 haneli kodu ve yeni şifreni gir.'}
              </Text>

              {forgotStep === 1 ? (
                <>
                  <Text style={styles.inputLabel}>E-posta veya Telefon No</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ornek@mail.com veya 05XX..."
                    placeholderTextColor="#998"
                    autoCapitalize="none"
                    value={identifier}
                    onChangeText={setIdentifier}
                  />
                  <TouchableOpacity
                    style={[styles.primaryBtn, { marginTop: 14 }]}
                    onPress={handleSendResetCode}
                  >
                    <Text style={styles.primaryBtnText}>Doğrulama Kodu Gönder</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.inputLabel}>6 Haneli Doğrulama Kodu</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="XXXXXX"
                    placeholderTextColor="#998"
                    keyboardType="number-pad"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                  />
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Yeni Şifre</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="En az 6 karakter"
                    placeholderTextColor="#998"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    style={[styles.primaryBtn, { marginTop: 14 }]}
                    onPress={handleConfirmReset}
                  >
                    <Text style={styles.primaryBtnText}>Şifreyi Güncelle ✨</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.switchPrompt}
                onPress={() => {
                  setMode('login');
                  clearMessages();
                }}
              >
                <Text style={styles.switchPromptText}>← Giriş Ekranına Dön</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================= 3. GOOGLE İLE BAĞLAN EKRANI ================= */}
          {mode === 'google' && (
            <View>
              <View style={styles.googleHeader}>
                <View style={styles.googleBadgeLarge}>
                  <Text style={styles.googleGLarge}>G</Text>
                </View>
                <Text style={styles.subCardTitle}>Google Hesabı Seç</Text>
                <Text style={styles.subCardDesc}>
                  TimeCapsule uygulamasına bağlanmak için Google hesabını doğrula.
                </Text>
              </View>

              <Text style={styles.inputLabel}>Google E-posta Adresin *</Text>
              <TextInput
                style={styles.input}
                placeholder="adiniz@gmail.com"
                placeholderTextColor="#998"
                keyboardType="email-address"
                autoCapitalize="none"
                value={googleEmail}
                onChangeText={setGoogleEmail}
              />

              <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                Görünen Adın (İsteğe bağlı)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Dilara"
                placeholderTextColor="#998"
                value={googleName}
                onChangeText={setGoogleName}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 16 }]}
                onPress={handleGoogleConnect}
              >
                <Text style={styles.primaryBtnText}>Google ile Devam Et ✓</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchPrompt}
                onPress={() => {
                  setMode('login');
                  clearMessages();
                }}
              >
                <Text style={styles.switchPromptText}>← Diğer Giriş Yöntemleri</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.footerNote}>
          🔒 Kayıtlı olmayan kullanıcılar kapsülleri görüntüleyemez.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  authCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 18,
    marginTop: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  topTape: {
    position: 'absolute',
    top: -8,
    left: '40%',
    width: 64,
    height: 16,
    backgroundColor: colors.washiKraft,
    borderRadius: 2,
    opacity: 0.9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.parchment,
    borderRadius: 12,
    padding: 4,
    marginTop: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.burgundy,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  errorBanner: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#E5A3A3',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B1E1E',
  },
  successBanner: {
    backgroundColor: '#EDF7EE',
    borderWidth: 1,
    borderColor: '#B5DFB9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#215C32',
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  methodPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  methodPillActive: {
    backgroundColor: '#F6E6E7',
    borderColor: colors.burgundy,
  },
  methodText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  methodTextActive: {
    color: colors.burgundyDark,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
  },
  eyeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eyeIcon: {
    fontSize: 15,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginTop: 2,
  },
  forgotLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.burgundy,
    textDecorationLine: 'underline',
  },
  primaryBtn: {
    backgroundColor: colors.burgundy,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldStar,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingVertical: 10,
  },
  googleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  googleG: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  switchPrompt: {
    marginTop: 14,
    alignItems: 'center',
  },
  switchPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.burgundyDark,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.burgundyDark,
    marginBottom: 4,
  },
  subCardDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  googleHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  googleBadgeLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  googleGLarge: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  footerNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
  },
});
